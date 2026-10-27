#!/usr/bin/env node

import { readFile, stat } from 'node:fs/promises';

// Headroom above the optimized media; see docs/media-performance.md.
const MiB = 1024 * 1024;
const budgets = { hero: 12 * MiB, menuImage: 300 * 1024, menuTotal: 5 * MiB };
let failed = false;
const fail = message => { failed = true; console.error(`❌ ${message}`); };
const size = bytes => `${bytes.toLocaleString('en-US')} bytes (${(bytes / MiB).toFixed(2)} MiB)`;

async function checkFile(file, limit) {
  try {
    const info = await stat(file);
    if (!info.isFile() || info.size === 0) {
      fail(`${file}: expected a non-empty file`);
    } else if (info.size > limit) {
      fail(`${file}: ${size(info.size)} exceeds budget ${size(limit)}`);
    }
    return info.size;
  } catch (error) {
    fail(`${file}: ${error.code === 'ENOENT' ? 'missing asset' : error.message}`);
    return 0;
  }
}

const heroBytes = await checkFile('assets/hero.mp4', budgets.hero);
let menu;
try {
  menu = JSON.parse(await readFile('assets/menu.json', 'utf8'));
  if (!Array.isArray(menu) || !menu.length) throw new Error('expected a non-empty array');
} catch (error) {
  fail(`assets/menu.json: ${error.message}`);
  process.exit(1);
}

// Content validation owns product fields/categories; this check is standalone
// so a bad path cannot evade payload accounting when run outside CI.
const paths = new Set();
for (const [index, item] of menu.entries()) {
  if (typeof item?.img !== 'string' || !/^assets\/menu\/[^/\\]+\.webp$/.test(item.img)) {
    fail(`assets/menu.json item ${item?.id ?? index}: expected assets/menu/*.webp, got ${JSON.stringify(item?.img)}`);
  } else {
    paths.add(item.img);
  }
}

let total = 0;
let largest = { file: '(none)', bytes: 0 };
for (const file of paths) {
  const bytes = await checkFile(file, budgets.menuImage);
  total += bytes;
  if (bytes > largest.bytes) largest = { file, bytes };
}
if (total > budgets.menuTotal) fail(`Menu total: ${size(total)} exceeds budget ${size(budgets.menuTotal)}`);

console.log(`Hero: ${size(heroBytes)} / ${size(budgets.hero)}`);
console.log(`Menu: ${paths.size} unique images, ${size(total)} / ${size(budgets.menuTotal)}`);
console.log(`Largest menu image: ${largest.file}, ${size(largest.bytes)} / ${size(budgets.menuImage)}`);
if (!failed) console.log('✅ Asset budgets passed');
process.exitCode = failed ? 1 : 0;

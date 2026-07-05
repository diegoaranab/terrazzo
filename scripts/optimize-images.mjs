#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const supportedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const repoRoot = process.cwd();

const groups = [
  {
    name: 'events',
    inputDir: path.join(repoRoot, '_incoming', 'events'),
    outputDir: path.join(repoRoot, 'assets', 'events'),
    width: 1200,
    quality: 82
  },
  {
    name: 'gallery',
    inputDir: path.join(repoRoot, '_incoming', 'gallery'),
    outputDir: path.join(repoRoot, 'assets', 'gallery'),
    width: 1600,
    quality: 82
  },
  {
    name: 'menu',
    inputDir: path.join(repoRoot, '_incoming', 'menu'),
    outputDir: path.join(repoRoot, 'assets', 'menu'),
    width: 1000,
    quality: 82
  },
  {
    name: 'hero',
    inputDir: path.join(repoRoot, '_incoming', 'hero'),
    outputDir: path.join(repoRoot, 'assets'),
    width: 1920,
    quality: 82
  }
];

const args = new Set(process.argv.slice(2));
const showHelp = args.has('--help') || args.has('-h');
const dryRun = args.has('--dry-run');
const force = args.has('--force');
const unknownArgs = [...args].filter((arg) => !['--help', '-h', '--dry-run', '--force'].includes(arg));

if (unknownArgs.length > 0) {
  console.error(`Unknown option${unknownArgs.length === 1 ? '' : 's'}: ${unknownArgs.join(', ')}`);
  console.error('Run `npm run optimize:images -- --help` for usage.');
  process.exit(1);
}

if (showHelp) {
  printHelp();
  process.exit(0);
}

const summary = {
  processed: 0,
  skipped: 0,
  inputBytes: 0,
  outputBytes: 0
};

await main();

async function main() {
  const incomingDir = path.join(repoRoot, '_incoming');

  if (!(await pathExists(incomingDir))) {
    console.log('No _incoming/ directory found.');
    console.log('Place raw images in _incoming/events, _incoming/gallery, _incoming/menu, or _incoming/hero, then run this command again.');
    printSummary();
    return;
  }

  console.log(`Image optimization${dryRun ? ' dry run' : ''}`);
  console.log(`Input root: ${relativePath(incomingDir)}`);
  console.log('');

  for (const group of groups) {
    await processGroup(group);
  }

  printSummary();
}

async function processGroup(group) {
  if (!(await pathExists(group.inputDir))) {
    console.log(`Skipping ${group.name}: ${relativePath(group.inputDir)} does not exist.`);
    return;
  }

  const files = await collectFiles(group.inputDir);
  const supportedFiles = files.filter((filePath) => supportedExtensions.has(path.extname(filePath).toLowerCase()));
  const unsupportedCount = files.length - supportedFiles.length;

  if (unsupportedCount > 0) {
    console.log(`Skipping ${unsupportedCount} unsupported file${unsupportedCount === 1 ? '' : 's'} in ${relativePath(group.inputDir)}.`);
    summary.skipped += unsupportedCount;
  }

  if (supportedFiles.length === 0) {
    console.log(`No supported images found in ${relativePath(group.inputDir)}.`);
    return;
  }

  if (!dryRun) {
    await fs.mkdir(group.outputDir, { recursive: true });
  }

  for (const inputPath of supportedFiles) {
    await processImage(inputPath, group);
  }
}

async function processImage(inputPath, group) {
  const basename = path.basename(inputPath, path.extname(inputPath));
  const outputPath = path.join(group.outputDir, `${basename}.webp`);
  const inputStats = await fs.stat(inputPath);

  if (!force && (await pathExists(outputPath))) {
    console.log(`Skipping existing output: ${relativePath(outputPath)} (use --force to overwrite)`);
    summary.skipped += 1;
    return;
  }

  summary.inputBytes += inputStats.size;

  if (dryRun) {
    console.log(`Would optimize: ${relativePath(inputPath)}`);
    console.log(`  Output: ${relativePath(outputPath)}`);
    console.log(`  Original size: ${formatBytes(inputStats.size)}`);
    console.log(`  Settings: width ${group.width}px, quality ${group.quality}, WebP`);
    summary.processed += 1;
    return;
  }

  await sharp(inputPath)
    .rotate()
    .resize({ width: group.width, withoutEnlargement: true })
    .webp({ quality: group.quality })
    .toFile(outputPath);

  const outputStats = await fs.stat(outputPath);
  const savings = savingsPercent(inputStats.size, outputStats.size);

  summary.processed += 1;
  summary.outputBytes += outputStats.size;

  console.log(`Optimized: ${relativePath(inputPath)}`);
  console.log(`  Output: ${relativePath(outputPath)}`);
  console.log(`  Original size: ${formatBytes(inputStats.size)}`);
  console.log(`  Optimized size: ${formatBytes(outputStats.size)}`);
  console.log(`  Savings: ${savings}`);
}

async function collectFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(entryPath)));
    } else if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function printHelp() {
  console.log(`Terrazzo image optimization

Usage:
  npm run optimize:images -- [options]

Options:
  --dry-run   Preview conversions without writing files.
  --force     Overwrite existing optimized output files.
  --help      Show this help message.

Input folders:
  _incoming/events   -> assets/events   width 1200, quality 82
  _incoming/gallery  -> assets/gallery  width 1600, quality 82
  _incoming/menu     -> assets/menu     width 1000, quality 82
  _incoming/hero     -> assets          width 1920, quality 82

Supported inputs:
  .jpg, .jpeg, .png, .webp

Examples:
  npm run optimize:images -- --help
  npm run optimize:images -- --dry-run
  npm run optimize:images
  npm run optimize:images -- --force`);
}

function printSummary() {
  const savings = summary.outputBytes > 0 ? savingsPercent(summary.inputBytes, summary.outputBytes) : 'n/a';

  console.log('');
  console.log('Summary');
  console.log(`  Processed: ${summary.processed}`);
  console.log(`  Skipped: ${summary.skipped}`);
  console.log(`  Total input size: ${formatBytes(summary.inputBytes)}`);
  console.log(`  Total output size: ${formatBytes(summary.outputBytes)}`);
  console.log(`  Total savings: ${savings}`);
}

function relativePath(filePath) {
  return path.relative(repoRoot, filePath) || '.';
}

function formatBytes(bytes) {
  if (bytes === 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;

  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

function savingsPercent(inputBytes, outputBytes) {
  if (inputBytes === 0) {
    return '0%';
  }

  return `${Math.round(((inputBytes - outputBytes) / inputBytes) * 100)}%`;
}

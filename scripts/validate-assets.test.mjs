import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, truncate, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const validator = fileURLToPath(new URL('./validate-assets.mjs', import.meta.url));

async function fixture(t, change = async () => {}) {
  const root = await mkdtemp(path.join(tmpdir(), 'terrazzo-assets-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, 'assets/menu'), { recursive: true });
  const file = name => path.join(root, name);
  const menu = [{ id: 'burger', img: 'assets/menu/burger.webp' }];
  await writeFile(file('assets/hero.mp4'), 'video');
  await writeFile(file(menu[0].img), 'image');
  await change({ file, menu });
  await writeFile(file('assets/menu.json'), JSON.stringify(menu));
  return spawnSync(process.execPath, [validator], { cwd: root, encoding: 'utf8' });
}

test('accepts media within budget and counts shared images once', async t => {
  const result = await fixture(t, async ({ menu }) => menu.push({ ...menu[0], id: 'second' }));
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /1 unique images/);
});

for (const img of ['assets/burger.png', 'assets/menu/burger.png', 'assets/menu/../burger.webp', 'assets/menu/..\\burger.webp']) {
  test(`rejects legacy or escaping reference: ${img}`, async t => {
    const result = await fixture(t, async ({ menu }) => { menu[0].img = img; });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /expected assets\/menu\/\*\.webp/);
  });
}

test('reports missing hero and menu files', async t => {
  const result = await fixture(t, async ({ file, menu }) => {
    await rm(file('assets/hero.mp4'));
    await rm(file(menu[0].img));
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /hero.mp4: missing asset/);
  assert.match(result.stderr, /burger.webp: missing asset/);
});

test('reports file size and budget for oversized hero and menu image', async t => {
  const result = await fixture(t, async ({ file, menu }) => {
    await truncate(file('assets/hero.mp4'), 12 * 1024 * 1024 + 1);
    await truncate(file(menu[0].img), 300 * 1024 + 1);
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /hero.mp4: .* exceeds budget/);
  assert.match(result.stderr, /burger.webp: .* exceeds budget/);
});

test('rejects total payload even when each image fits its budget', async t => {
  const result = await fixture(t, async ({ file, menu }) => {
    menu.length = 0;
    for (let i = 0; i < 18; i++) {
      const img = `assets/menu/${i}.webp`;
      menu.push({ id: String(i), img });
      await writeFile(file(img), 'image');
      await truncate(file(img), 300 * 1024);
    }
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Menu total: .* exceeds budget/);
  assert.doesNotMatch(result.stderr, /\.webp: .* exceeds budget/);
});

test('rejects empty files and malformed content', async t => {
  const empty = await fixture(t, async ({ file, menu }) => { await truncate(file(menu[0].img), 0); });
  assert.equal(empty.status, 1);
  assert.match(empty.stderr, /expected a non-empty file/);
  const invalid = await fixture(t, async ({ menu }) => { menu.length = 0; });
  assert.equal(invalid.status, 1);
  assert.match(invalid.stderr, /expected a non-empty array/);
});

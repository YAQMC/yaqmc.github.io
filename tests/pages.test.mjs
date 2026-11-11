import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
const root = path.resolve(import.meta.dirname, '../dist');
for (const file of ['index.html', 'en/index.html'])
  test(file + ': language, demo and local assets resolve', () => {
    const html = readFileSync(path.join(root, file), 'utf8');
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    assert.match(html, /<iframe/);
    for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
      const link = match[1].split('?')[0];
      if (link.startsWith('https://')) continue;
      assert.ok(existsSync(path.resolve(root, path.dirname(file), link)), link);
    }
  });
test('old project site routes redirect and exact source identity is exposed', () => {
  for (const route of ['YAQMC', 'YAQMC/en', 'YAQMC/demo'])
    assert.match(readFileSync(path.join(root, route, 'index.html'), 'utf8'), /location.replace/);
  const source = JSON.parse(readFileSync(path.join(root, 'SOURCE.json'), 'utf8'));
  assert.match(source.revision, /^[a-f0-9]{40}$/);
  assert.equal(source.repository, 'YAQMC/YAQMC');
});

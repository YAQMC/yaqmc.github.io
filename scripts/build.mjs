import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const upstream = JSON.parse(readFileSync(path.join(root, 'UPSTREAM.json'), 'utf8'));
const client = path.join(root, '.client');
if (!existsSync(path.join(client, '.git'))) {
  mkdirSync(client, { recursive: true });
  execFileSync('git', ['init', client]);
  execFileSync('git', [
    '-C',
    client,
    'remote',
    'add',
    'origin',
    'https://github.com/YAQMC/YAQMC.git',
  ]);
}
execFileSync('git', ['-C', client, 'fetch', '--depth=1', 'origin', upstream.revision], {
  stdio: 'inherit',
});
execFileSync('git', ['-C', client, 'checkout', '--detach', upstream.revision], {
  stdio: 'inherit',
});
execFileSync('npm', ['ci'], { cwd: client, stdio: 'inherit', shell: process.platform === 'win32' });
const output = path.join(root, 'dist');
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
cpSync(path.join(root, 'site'), output, { recursive: true });
mkdirSync(path.join(output, 'assets'), { recursive: true });
cpSync(path.join(client, 'assets/yaqmc-logo.png'), path.join(output, 'assets/yaqmc-logo.png'));
cpSync(path.join(client, 'src/styles/tokens.css'), path.join(output, 'tokens.css'));
mkdirSync(path.join(client, 'src/development'), { recursive: true });
for (const name of ['website-demo.tsx', 'website-song.ts', 'website-song.test.ts'])
  cpSync(path.join(root, 'demo', name), path.join(client, 'src/development', name));
execFileSync(
  process.execPath,
  [path.join(client, 'scripts/run-vitest.mjs'), 'run', 'src/development/website-song.test.ts'],
  { cwd: client, stdio: 'inherit' },
);
cpSync(path.join(root, 'demo/vite.website.config.ts'), path.join(client, 'vite.website.config.ts'));
execFileSync(
  process.execPath,
  [
    path.join(client, 'node_modules/vite/bin/vite.js'),
    'build',
    '--config',
    'vite.website.config.ts',
    '--outDir',
    path.join(output, 'demo'),
  ],
  { cwd: client, stdio: 'inherit' },
);
writeFileSync(path.join(output, '.nojekyll'), '');
writeFileSync(path.join(output, 'SOURCE.json'), JSON.stringify(upstream, null, 2) + '\n');
for (const route of ['YAQMC', 'YAQMC/en', 'YAQMC/demo']) {
  const destination = route.replace(/^YAQMC\/?/, '');
  const url = '/' + (destination ? destination + '/' : '');
  const directory = path.join(output, route);
  mkdirSync(directory, { recursive: true });
  writeFileSync(
    path.join(directory, 'index.html'),
    '<!doctype html><meta charset="utf-8"><title>YAQMC</title><a href="' +
      url +
      '">Continue to YAQMC</a><script>location.replace(' +
      JSON.stringify(url) +
      '+location.search+location.hash)</script>',
  );
}
console.log('Website built at ' + output);

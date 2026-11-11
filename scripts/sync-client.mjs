import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
const revision = execFileSync(
  'git',
  ['ls-remote', 'https://github.com/YAQMC/YAQMC.git', 'refs/heads/main'],
  { encoding: 'utf8' },
).split(/\s/)[0];
if (!/^[a-f0-9]{40}$/.test(revision)) throw new Error('Invalid source revision');
writeFileSync(
  'UPSTREAM.json',
  JSON.stringify({ repository: 'YAQMC/YAQMC', revision }, null, 2) + '\n',
);

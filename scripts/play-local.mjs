import {spawn} from 'node:child_process';
import {existsSync} from 'node:fs';
import {networkInterfaces} from 'node:os';
import path from 'node:path';
import {projectRoot} from './sites-env.mjs';

const [major, minor] = process.versions.node.split('.').map(Number);
if (major < 22 || (major === 22 && minor < 13)) {
  throw new Error('Can Node.js 22.13 tro len. Cai Node.js LTS roi thu lai.');
}
if (!process.env.npm_execpath) throw new Error('Hay chay: npm run play');
let child;
let stopping = false;
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => {
  stopping = true;
  child?.kill(signal);
});
function run(script) {
  return new Promise((resolve, reject) => {
    child = spawn(process.execPath, [process.env.npm_execpath, 'run', script], {
      cwd: projectRoot, env: process.env, stdio: 'inherit',
    });
    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (stopping) process.exit(0);
      if (code === 0) resolve();
      else reject(new Error(`${script} dung voi ma ${code ?? signal}. Xem loi ben tren.`));
    });
  });
}
if (!existsSync(path.join(projectRoot, 'node_modules/wrangler/bin/wrangler.js'))) {
  await run('install:ci');
}
await run('check');
await run('build');
await run('db:migrate');
if (!process.argv.includes('--prepare-only')) {
  console.log('\nMo game tren may nay: http://localhost:8787');
  for (const addresses of Object.values(networkInterfaces())) {
    for (const address of addresses || []) {
      if (address.family === 'IPv4' && !address.internal) {
        console.log(`May/telefon cung Wi-Fi: http://${address.address}:8787`);
      }
    }
  }
  console.log('Giu cua so nay mo khi choi. Ctrl+C de tat may chu.\n');
  await run('start');
}

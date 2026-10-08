import {spawnSync} from 'node:child_process';
import {renameSync} from 'node:fs';
// Vinext detects Workers from this filename even when the Node config is selected.
// Hide it only for this synchronous build and always restore the local config.
renameSync('wrangler.jsonc','wrangler.jsonc.node-build');
let status=1;
try {
 const result=spawnSync(process.execPath,['--import','./scripts/sites-env.mjs','./node_modules/vinext/dist/cli.js','build'],{stdio:'inherit',env:{...process.env,RPG_RUNTIME:'node'}});
 status=result.status??1;
} finally {renameSync('wrangler.jsonc.node-build','wrangler.jsonc');}
process.exit(status);

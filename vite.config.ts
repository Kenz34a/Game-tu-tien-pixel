import vinext from 'vinext';
import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig(async () => {
  if(process.env.RPG_RUNTIME==='node')return {server:{host:'0.0.0.0'},resolve:{alias:{'cloudflare:workers':path.resolve('lib/node-env.ts')}},plugins:[vinext()]};
  process.env.CLOUDFLARE_CF_FETCH_ENABLED ??= 'false';
  process.env.WRANGLER_SEND_METRICS ??= 'false';
  process.env.WRANGLER_WRITE_LOGS ??= 'false';
  process.env.WRANGLER_LOG_PATH ??= '.wrangler/logs';
  process.env.WRANGLER_REGISTRY_PATH ??= '.wrangler/dev-registry';
  process.env.MINIFLARE_REGISTRY_PATH ??= '.wrangler/registry';
  const { cloudflare } = await import('@cloudflare/vite-plugin');
  return {
    server: { host: '0.0.0.0' },
    plugins: [vinext(), cloudflare({
      configPath: 'wrangler.jsonc',
      viteEnvironment: { name: 'rsc', childEnvironments: ['ssr'] },
      inspectorPort: false,
    })],
  };
});

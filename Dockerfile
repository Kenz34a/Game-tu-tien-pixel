# syntax=docker/dockerfile:1
FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=secret,id=proxy_ca \
    if [ -f /run/secrets/proxy_ca ]; then export NODE_EXTRA_CA_CERTS=/run/secrets/proxy_ca; fi; \
    npm ci --include=dev --include=optional --no-audit --no-fund
COPY . .
RUN npm run check && npm run build \
    && mkdir /runtime \
    && cp -a node_modules dist scripts drizzle wrangler.jsonc package.json /runtime/

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production PORT=8787 RPG_STATE_DIR=/var/data/rpg WRANGLER_SEND_METRICS=false
RUN mkdir -p /var/data/rpg && chown -R node:node /var/data /app
COPY --from=build --chown=node:node /runtime/ ./
USER node
EXPOSE 8787
CMD ["node", "scripts/start-render.mjs"]

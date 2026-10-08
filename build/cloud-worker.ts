import handler from 'vinext/server/fetch-handler';

// Independent Cloud Environment runtime; no Sites auth or connector service.
export default {
  fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext) {
    return handler.fetch(request, env, ctx);
  },
};

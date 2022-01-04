import { POST, GET, route } from 'awilix-koa';
import routes from '../routes';

const sessionCache = {};

@route(routes.session.root)
export default class SessionController {
  constructor({ gipsApiService }) {
    this.gipsApiService = gipsApiService;
  }

  @POST()
  @route(routes.session.cache)
  async cacheSession(ctx) {
    const {
      body,
      query: { sessionId },
    } = ctx.request;

    console.info('cache session', body);

    sessionCache[sessionId] = body;

    ctx.respondWith({ status: 'success' });
  }

  @GET()
  @route(routes.session.cache)
  async restoreSession(ctx) {
    const {
      query: { sessionId },
    } = ctx.request;

    ctx.respondWith({ ...sessionCache[sessionId], status: 'success' });
  }
}

import { GET, route } from 'awilix-koa';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import routes from '../routes';

@route(routes.pug.root)
export default class PugController {
  @GET()
  @route(routes.pug.sslAuth)
  async sslAuth(ctx) {
    const target = get(ctx, 'params[0]');
    const buffer = Buffer(target, 'base64');
    const targetUrl = buffer.toString('ascii');
    await ctx.render(
      'ssl',
      { targetUrl: isEmpty(targetUrl) ? '/auth/thanks' : targetUrl },
      { fromString: false },
    );
  }

  @GET()
  @route(routes.pug.thanks)
  async thanks(ctx) {
    await ctx.render('thanks', {}, { fromString: false });
  }
}

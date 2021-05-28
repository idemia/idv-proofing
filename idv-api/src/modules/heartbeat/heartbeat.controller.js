import { GET, route } from 'awilix-koa';
import moment from 'moment';
import routes from '../routes';

@route(routes.heartbeat.root)
export default class HeartBeatController {
  @GET()
  async heartbeat(ctx) {
    ctx.ok({ status: 'success', time: moment().toISOString() });
  }
}

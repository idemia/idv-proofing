import Koa from 'koa';
import * as https from 'https';
import compress from 'koa-compress';
import bodyParser from 'koa-body';
import respond from 'koa-respond';
import cors from '@koa/cors';
import helmet from 'koa-helmet';
import sslify from 'koa-sslify';
import fs from 'fs';
import { usePug } from './pug';
import { loadControllers, scopePerRequest } from 'awilix-koa';
import { configureLogger, logger } from './logger';
import { configureContainer } from './container';
import { respondEnhancer } from '../middleware/respond-enhancer';
import { requestLogger } from '../middleware/request-logger';
import limiter from './rateLimiter';

export const createServer = async () => {
  try {
    configureLogger();
    logger.debug('Starting server...');
    const app = new Koa();
    const container = (app.container = await configureContainer());
    usePug(app);
    app
      .use(sslify())
      .use(compress())
      .use(respond())
      .use(
        cors({
          credentials: true,
          exposeHeaders: 'X-Auth, Content-Type, Content-Length',
          allowHeaders: 'X-Auth, Content-Type, Accept',
        }),
      )
      .use(limiter)
      .use(
        bodyParser({
          multipart: true,
          formLimit: '10mb',
          jsonLimit: '10mb',
        }),
      )
      .use(respondEnhancer())
      .use(scopePerRequest(container))
      .use(helmet())
      .use(requestLogger)
      .use(
        loadControllers('../modules/**/*.controller.js', { cwd: __dirname }),
      );

    if (!fs.existsSync('ssl/key.pem') || !fs.existsSync('ssl/cert.pem')) {
      console.warn('Certificates does not exists. Generate them to run API!');
    }

    const server = https.createServer(
      {
        key: fs.readFileSync('ssl/key.pem'),
        cert: fs.readFileSync('ssl/cert.pem'),
        requestCert: false,
        rejectUnauthorized: false,
      },
      app.callback(),
    );

    logger.debug('Server started.');
    return server;
  } catch (e) {
    logger.error('ERROR: ', e);
  }
};

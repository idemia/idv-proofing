import { logger } from '../lib/logger';
import { env } from '../lib/env';

function _logItem({ item, type }) {
  if (!env.ENABLE_REQUESTS_LOGGER) {
    return;
  }
  const logData = {
    type,
    body: item.body,
    headers: item.headers,
  };
  if (type === 'request') {
    logData['path'] = item.path;
    logData['query'] = item.query;
  }
  if (type === 'response') {
    logData['status'] = item.status;
  }
  logger.debug(logData);
}

export async function requestLogger(ctx, next) {
  _logItem({ item: ctx.request, type: 'request' });
  await next();
  _logItem({ item: ctx.response, type: 'response' });
}

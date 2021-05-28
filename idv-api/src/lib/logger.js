import { Bristol } from 'bristol';
import palin from 'palin';
import { env } from './env';

export const logger = new Bristol();

export const configureLogger = (level) => {
  /* istanbul ignore next */
  if ((env && env.LOG_LEVEL !== 'off') || level) {
    logger.addTarget('console').withFormatter(palin, {
      rootFolderName: 'idv',
    });
    logger.info(`Logger set up with level: ${env.LOG_LEVEL}`);
  }
};

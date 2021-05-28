import socketio from 'socket.io';

import { createServer } from '../lib/server';
import { env } from '../lib/env';
import { logger } from '../lib/logger';

createServer().then(
  (app) => {
    const io = socketio(app, {
      cors: {
        origin: '*',
      },
    });

    // socket connection
    io.on('connection', (socket) => {
      socket.on('mobileInit', (data) => {
        console.log('mobileInit', data);
        io.emit('mobileInitialized', data);
      });
      socket.on('showDesktopSummary', (data) => {
        console.log('showDesktopSummary', data);
        io.emit('mobileWizardFinished', data);
      });
      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });

    app.listen(env.PORT, () => {
      const mode = env.NODE_ENV;
      logger.debug(`Server listening on ${env.PORT} in ${mode} mode`);
    });
  },
  (err) => {
    logger.error('Error while starting up server', err);
    process.exit(1);
  },
);

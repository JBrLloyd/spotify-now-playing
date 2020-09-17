import { Express } from 'express';
import fetch from 'node-fetch';

import { spotifyController } from './controllers';

export const setup = (app: Express): void => {
  app.get('/current.svg', spotifyController.getCurrentlyPlayingSongSvg);
};
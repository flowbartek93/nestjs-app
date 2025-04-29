import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  messagePrefix: process.env.APP_MESSAGEE_PREFIX ?? 'default prefix',
}));

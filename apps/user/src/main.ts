import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeApp, cert } from 'firebase-admin/app';
import { credential } from 'common/credential/mrgreen-dbf25-firebase-adminsdk-7ap2n-f6132b1741';

const bootstrap = async () => {
  initializeApp({
    credential: cert(credential),
  });

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);
};
bootstrap();

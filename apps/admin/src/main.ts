import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { initializeApp, cert } from 'firebase-admin/app';
import { credential } from 'common/credential/mrgreen-dbf25-firebase-adminsdk-7ap2n-f6132b1741';
import { mkdir } from 'node:fs';

const bootstrap = async () => {
  initializeApp({
    credential: cert(credential),
  });

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: 'https://greenmaker-admin-client.onrender.com',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Green Maker')
    .setDescription('The API description')
    .setVersion('1.0');

  const tags = [
    'auth',
    'article',
    'commodity',
    'common-data',
    'income',
    'image',
    'expense',
    'plant',
    'warehouse',
  ];

  tags.forEach((tag) => config.addTag(tag));

  const document = SwaggerModule.createDocument(app, config.build());
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      defaultModelExpandDepth: 5,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
};
bootstrap();

const uploadFolderInit = async () => {
  mkdir(process.cwd() + '/upload', (error) => {
    if (!error || error.code === 'EEXIST') {
      mkdir(process.cwd() + '/upload/Article', console.log);
      mkdir(process.cwd() + '/upload/Commodity', console.log);
      mkdir(process.cwd() + '/upload/Plant', console.log);
    } else {
      console.log(error);
    }
  });
};
uploadFolderInit();

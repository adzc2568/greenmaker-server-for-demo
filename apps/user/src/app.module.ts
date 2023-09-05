import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import MongoConfigFactory from '../../config/mongo.config';
import { join } from 'path';
import { ArticleModule } from './features/article/article.module';
import { CommonDataModule } from './features/common-data/common-data.module';
import { ImageModule } from './features/image/image.module';
import { FirebaseModule } from './features/firebase/firebase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [MongoConfigFactory],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('mongo.uri'),
      }),
      connectionName: 'mrgreen',
    }),

    CacheModule.register({
      ttl: 1000 * 60 * 60,
      isGlobal: true,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'upload'),
      exclude: ['/api/(.*)'],
    }),

    ArticleModule,

    CommonDataModule,

    ImageModule,

    FirebaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}

import {
  MiddlewareConsumer,
  Module,
  NestModule,
  Provider,
} from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
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
import { PlantModule } from './features/plant/plant.module';
import { CommodityModule } from './features/commodity/commodity.module';
import { ExpenseModule } from './features/expense/expense.module';
import { IncomeModule } from './features/income/income.module';
import { WarehouseModule } from './features/warehouse/warehouse.module';
import { StockRecordModule } from './features/stock-record/stock-record.module';
import { PurchaseOrderModule } from './features/purchase-order/purchase-order.module';
import { ContactModule } from './features/contact/contact.module';
import { AuthGuard } from './common/guard/auth.guard';
import { AuthModule } from './features/auth/auth.module';
import { WarehouseSkuModule } from './features/warehouse-sku/warehouse-sku.module';
import { WorkRecordModule } from './features/work-record/work-record.module';
import { WeatherModule } from './features/weather/weather.module';
import { CommoditySkuModule } from './features/commodity-sku/commodity-sku.module';
import { UserModule } from './features/user/user.module';
import { MessageModule } from './features/message/message.module';

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
      rootPath: join(__dirname, '..', '..', '..', 'upload'),
      exclude: ['/api/(.*)'],
    }),

    ArticleModule,

    CommonDataModule,

    ImageModule,

    PlantModule,

    CommodityModule,

    IncomeModule,

    ExpenseModule,

    WarehouseModule,

    WarehouseSkuModule,

    StockRecordModule,

    PurchaseOrderModule,

    ContactModule,

    AuthModule,

    WorkRecordModule,

    WeatherModule,

    CommoditySkuModule,

    UserModule,

    MessageModule,
  ],
  controllers: [AppController],
  providers: (() => {
    const providers: Provider[] = [AppService];
    if (process.env.DEV !== 'true') {
      providers.push({
        provide: APP_GUARD,
        useClass: AuthGuard,
      });
    }
    return providers;
  })(),
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}

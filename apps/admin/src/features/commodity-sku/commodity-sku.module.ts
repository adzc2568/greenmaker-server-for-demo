import { Module, CacheInterceptor, ExecutionContext } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommoditySkuService } from './commodity-sku.service';
import {
  CommoditySku,
  CommoditySkuSchema,
} from 'common/models/commodity-sku.model';
import { ImageModule } from '../image/image.module';
import { trackBy } from 'common/methods/trackBy';

class CommoditySkuCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    return trackBy(context, '/api/commodity-sku');
  }
}

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: CommoditySku.name, schema: CommoditySkuSchema }],
      'mrgreen',
    ),

    ImageModule,
  ],

  providers: [CommoditySkuCacheInterceptor, CommoditySkuService],
  exports: [CommoditySkuService],
})
export class CommoditySkuModule {}

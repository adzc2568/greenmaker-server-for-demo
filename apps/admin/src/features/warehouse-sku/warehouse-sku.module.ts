import { Module, CacheInterceptor, ExecutionContext } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WarehouseSkuService } from './warehouse-sku.service';
import {
  WarehouseSku,
  WarehouseSkuSchema,
} from 'common/models/warehouse-sku.model';
import { ImageModule } from '../image/image.module';
import { trackBy } from 'common/methods/trackBy';

class WarehouseSkuCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    return trackBy(context, '/api/warehouse-sku');
  }
}

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: WarehouseSku.name, schema: WarehouseSkuSchema }],
      'mrgreen',
    ),

    ImageModule,
  ],

  providers: [WarehouseSkuCacheInterceptor, WarehouseSkuService],
  exports: [WarehouseSkuService],
})
export class WarehouseSkuModule {}

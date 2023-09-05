import {
  Module,
  Injectable,
  CacheInterceptor,
  ExecutionContext,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Warehouse, WarehouseSchema } from 'common/models/warehouse.model';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';
import { StockRecordModule } from '../stock-record/stock-record.module';
import { trackBy } from 'common/methods/trackBy';
import { WarehouseSkuModule } from '../warehouse-sku/warehouse-sku.module';

@Injectable()
class WarehouseCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    return trackBy(context, ['/api/warehouse']);
  }
}

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Warehouse.name, schema: WarehouseSchema }],
      'mrgreen',
    ),

    StockRecordModule,

    WarehouseSkuModule,
  ],
  controllers: [WarehouseController],
  providers: [WarehouseCacheInterceptor, WarehouseService],
  exports: [WarehouseService],
})
export class WarehouseModule {}

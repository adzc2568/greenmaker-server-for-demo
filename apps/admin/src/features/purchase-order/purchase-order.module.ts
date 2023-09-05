import { Module, CacheInterceptor, ExecutionContext } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PurchaseOrderService } from './purchase-order.service';
import { PurchaseOrderController } from './purchase-order.controller';
import {
  PurchaseOrder,
  PurchaseOrderSchema,
} from 'common/models/purchase-order.model';
import { WarehouseSkuModule } from '../warehouse-sku/warehouse-sku.module';
import { ExpenseModule } from '../expense/expense.module';
import { trackBy } from 'common/methods/trackBy';
import { StockRecordModule } from '../stock-record/stock-record.module';

class PurchaseOrderCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    return trackBy(context, ['/api/purchase-order']);
  }
}

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: PurchaseOrder.name, schema: PurchaseOrderSchema }],
      'mrgreen',
    ),

    WarehouseSkuModule,

    ExpenseModule,

    StockRecordModule,
  ],
  controllers: [PurchaseOrderController],
  providers: [PurchaseOrderCacheInterceptor, PurchaseOrderService],
})
export class PurchaseOrderModule {}

import { Module, CacheInterceptor, ExecutionContext } from '@nestjs/common';
import { StockRecordService } from './stock-record.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  StockRecord,
  StockRecordSchema,
} from 'common/models/stock-record.model';
import { trackBy } from 'common/methods/trackBy';
import { StockRecordController } from './stock-record.controller';

class StockRecordCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    return trackBy(context, ['/api/stock-record']);
  }
}

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: StockRecord.name, schema: StockRecordSchema }],
      'mrgreen',
    ),
  ],
  providers: [StockRecordCacheInterceptor, StockRecordService],
  exports: [StockRecordService],
  controllers: [StockRecordController],
})
export class StockRecordModule {}

import {
  Module,
  Injectable,
  CacheInterceptor,
  ExecutionContext,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkRecord, WorkRecordSchema } from 'common/models/work-record.model';
import { WorkRecordController } from './work-record.controller';
import { WorkRecordService } from './work-record.service';
import { trackBy } from 'common/methods/trackBy';
import { ScheduleModule } from '@nestjs/schedule';

@Injectable()
class WorkRecordCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    return trackBy(context, ['/api/work-record']);
  }
}

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: WorkRecord.name, schema: WorkRecordSchema }],
      'mrgreen',
    ),

    ScheduleModule.forRoot(),
  ],
  controllers: [WorkRecordController],
  providers: [WorkRecordCacheInterceptor, WorkRecordService],
})
export class WorkRecordModule {}

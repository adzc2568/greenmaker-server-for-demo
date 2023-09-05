import { Module, CacheInterceptor, ExecutionContext } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonDataService } from './common-data.service';
import { CommonDataController, ListController } from './common-data.controller';
import {
  CommonData,
  CommonDataSchema,
} from 'common/models/common-data.model';
import { trackBy } from 'common/methods/trackBy';

class CommonDataCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    return trackBy(context, ['/api/common-data', '/api/list']);
  }
}

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: CommonData.name, schema: CommonDataSchema }],
      'mrgreen',
    ),
  ],
  controllers: [CommonDataController, ListController],

  providers: [CommonDataCacheInterceptor, CommonDataService],
})
export class CommonDataModule {}

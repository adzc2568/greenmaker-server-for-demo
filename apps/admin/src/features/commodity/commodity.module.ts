import {
  Module,
  Injectable,
  CacheInterceptor,
  ExecutionContext,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Commodity, CommoditySchema } from 'common/models/commodity.model';
import { CommodityController } from './commodity.controller';
import { CommodityService } from './commodity.service';
import { ImageModule } from '../image/image.module';
import { trackBy } from 'common/methods/trackBy';

@Injectable()
class CommodityCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    return trackBy(context, '/api/commodity');
  }
}

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Commodity.name, schema: CommoditySchema }],
      'mrgreen',
    ),

    ImageModule,
  ],
  controllers: [CommodityController],
  providers: [CommodityCacheInterceptor, CommodityService],
})
export class CommodityModule {}

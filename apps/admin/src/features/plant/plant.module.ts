import { Module, CacheInterceptor, ExecutionContext } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlantService } from './plant.service';
import { PlantController } from './plant.controller';
import { Plant, PlantSchema } from 'common/models/plant.model';
import { ImageModule } from '../image/image.module';
import { trackBy } from 'common/methods/trackBy';

class PlantCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    return trackBy(context, '/api/plant');
  }
}

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Plant.name, schema: PlantSchema }],
      'mrgreen',
    ),

    ImageModule,
  ],

  controllers: [PlantController],

  providers: [PlantCacheInterceptor, PlantService],
})
export class PlantModule {}

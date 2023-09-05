import {
  Module,
  Injectable,
  CacheInterceptor,
  ExecutionContext,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Weather, WeatherSchema } from 'common/models/weather.model';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { trackBy } from 'common/methods/trackBy';
import { ScheduleModule } from '@nestjs/schedule';

@Injectable()
class WeatherCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    return trackBy(context, ['/api/weather']);
  }
}

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Weather.name, schema: WeatherSchema }],
      'mrgreen',
    ),

    ScheduleModule.forRoot()
  ],
  controllers: [WeatherController],
  providers: [WeatherCacheInterceptor, WeatherService],
})
export class WeatherModule {}

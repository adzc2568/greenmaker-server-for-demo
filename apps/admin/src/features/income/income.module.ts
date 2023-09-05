import { Module, CacheInterceptor, ExecutionContext } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IncomeService } from './income.service';
import { IncomeController } from './income.controller';
import { Income, IncomeSchema } from 'common/models/income.model';
import { trackBy } from 'common/methods/trackBy';

class IncomeCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    return trackBy(context, ['/api/income']);
  }
}

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Income.name, schema: IncomeSchema }],
      'mrgreen',
    ),
  ],

  controllers: [IncomeController],
  providers: [IncomeCacheInterceptor, IncomeService],
  exports: [IncomeService],
})
export class IncomeModule {}

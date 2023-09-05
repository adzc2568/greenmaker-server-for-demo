import { Module, CacheInterceptor, ExecutionContext } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { Expense, ExpenseSchema } from 'common/models/expense.model';
import { trackBy } from 'common/methods/trackBy';

class ExpenseCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    return trackBy(context, ['/api/expense']);
  }
}

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Expense.name, schema: ExpenseSchema }],
      'mrgreen',
    ),
  ],

  controllers: [ExpenseController],
  providers: [ExpenseCacheInterceptor, ExpenseService],
  exports: [ExpenseService],
})
export class ExpenseModule {}

import { Module, CacheInterceptor, ExecutionContext } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { Message, MessageSchema } from 'common/models/message.model';
import { trackBy } from 'common/methods/trackBy';

class MessageCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    return trackBy(context, ['/api/message']);
  }
}

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Message.name, schema: MessageSchema }],
      'mrgreen',
    ),
  ],

  controllers: [MessageController],
  providers: [MessageCacheInterceptor, MessageService],
  exports: [MessageService],
})
export class MessageModule {}

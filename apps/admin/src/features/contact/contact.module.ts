import { Module, CacheInterceptor, ExecutionContext } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import {
  Contact,
  ContactSchema,
} from 'common/models/contact.model';
import { trackBy } from 'common/methods/trackBy';

class ContactCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    return trackBy(context, ['/api/contact']);
  }
}

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Contact.name, schema: ContactSchema }],
      'mrgreen',
    ),
  ],
  controllers: [ContactController],

  providers: [ContactCacheInterceptor, ContactService],
})
export class ContactModule {}

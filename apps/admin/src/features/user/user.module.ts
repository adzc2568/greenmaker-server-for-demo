import { Module, CacheInterceptor, ExecutionContext } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from 'common/models/user.model';
import { trackBy } from 'common/methods/trackBy';

class UserCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    return trackBy(context, ['/api/user']);
  }
}

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      'mrgreen',
    ),
  ],

  controllers: [UserController],
  providers: [UserCacheInterceptor, UserService],
  exports: [UserService],
})
export class UserModule {}

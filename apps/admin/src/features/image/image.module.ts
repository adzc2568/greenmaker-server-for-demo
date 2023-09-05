import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Image, ImageSchema } from 'common/models/image.model';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { ImageGateway } from './image.gateway';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Image.name, schema: ImageSchema }],
      'mrgreen',
    ),

    FirebaseModule,
  ],
  controllers: [ImageController],
  providers: [ImageService, ImageGateway],
  exports: [ImageService],
})
export class ImageModule {}

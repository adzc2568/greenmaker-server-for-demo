import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ImageDocument = Image & Document;

@Schema({ _id: false })
class ImageData {
  @Prop({ required: true, type: String })
  BasePath: string;

  @Prop({ required: true, type: Number })
  Width: number;

  @Prop({ required: true, type: Number })
  Height: number;
}
const ImageDataSchema = SchemaFactory.createForClass(ImageData);

@Schema({
  collection: 'Image',
  id: false,
  versionKey: false,
})
export class Image {
  @Prop({
    required: true,
    type: String,
  })
  Type: string;

  @Prop({
    required: true,
    type: String,
  })
  Name: string;

  @Prop({
    required: function () {
      return this.Description !== null;
    },
    type: String,
  })
  Description: string;

  @Prop({ required: true, type: ImageDataSchema })
  Origin: ImageData;

  @Prop({ required: true, type: ImageDataSchema })
  Thumb: ImageData;
}

export const ImageSchema = SchemaFactory.createForClass(Image);

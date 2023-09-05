import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CommonDataDocument = CommonData & Document;

@Schema({ collection: 'CommonData', id: false, versionKey: false })
export class CommonData {
  @Prop({ type: String, required: true })
  Category: string;

  @Prop({ type: String, required: true })
  Id: string;

  @Prop({ type: String, required: true })
  Name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  ParentId: MongooseSchema.Types.ObjectId;
}

export const CommonDataSchema = SchemaFactory.createForClass(CommonData);

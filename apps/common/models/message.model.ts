import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({
  collection: 'Message',
  id: false,
  versionKey: false,
  timestamps: {
    createdAt: 'CreateDate',
    updatedAt: false,
  },
})
export class Message {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  ConversationId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  SenderId: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, required: true })
  Content: string;

  @Prop({ type: Boolean, required: true })
  IsReaded: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

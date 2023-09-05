import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IncomeDocument = Income & Document;

@Schema({
  collection: 'Income',
  id: false,
  versionKey: false,
})
export class Income {
  @Prop({ type: Date, required: true })
  Date: Date;

  @Prop({ type: String, required: true })
  ItemName: string;

  @Prop({ type: Number, required: true })
  Cost: number;

  @Prop({ type: Number, required: true })
  Amount: number;

  @Prop({ type: String })
  Remark: string;
}

export const IncomeSchema = SchemaFactory.createForClass(Income);

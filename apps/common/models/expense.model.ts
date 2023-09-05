import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ExpenseDocument = Expense & Document;

@Schema({
  collection: 'Expense',
  id: false,
  versionKey: false,
})
export class Expense {
  @Prop({ type: Date, required: true })
  Date: Date;

  @Prop({ type: String, required: true })
  ItemName: string;

  @Prop({ type: Number, required: true })
  Cost: number;

  @Prop({
    type: String,
    required: function () {
      return this.Remark !== null;
    },
  })
  Remark: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: function () {
      return this.OrderId !== null;
    },
  })
  OrderId: MongooseSchema.Types.ObjectId;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);

ExpenseSchema.set('toJSON', { virtuals: true });

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ _id: false })
class Cart {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  WarehouseId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  WarehouseSkuId: MongooseSchema.Types.ObjectId;

  @Prop({ type: Number, required: true })
  Amount: number;
}

const CartSchema = SchemaFactory.createForClass(Cart);

@Schema({ _id: false })
class BuyerInfo {
  @Prop({ type: String, required: true })
  DeliveryType: string;

  @Prop({ type: String, required: true })
  ReceiverName: string;

  @Prop({ type: String, required: true })
  Address: string;
}

const BuyerInfoSchema = SchemaFactory.createForClass(BuyerInfo);

@Schema({
  collection: 'User',
  id: false,
  versionKey: false,
})
export class User {
  @Prop({ type: String, required: true })
  Account: string;

  @Prop({ type: String, required: true })
  Uid: string;

  @Prop({ type: [BuyerInfoSchema], required: true })
  BuyerInfos: BuyerInfo[];

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: function () {
      return this.ConversationId !== null;
    },
  })
  ConversationId: MongooseSchema.Types.ObjectId;

  @Prop({ type: [CartSchema], required: true })
  Carts: Cart[];
}

export const UserSchema = SchemaFactory.createForClass(User);

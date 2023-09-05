import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type PurchaseOrderDocument = PurchaseOrder & Document;

@Schema({ _id: false })
class Detail {
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
  })
  WarehouseId: MongooseSchema.Types.ObjectId;

  @Prop({
    required: true,
    type: String,
  })
  WarehouseName: string;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
  })
  SkuId: MongooseSchema.Types.ObjectId;

  @Prop({
    required: true,
    type: String,
  })
  SkuName: string;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
  })
  ContactId: MongooseSchema.Types.ObjectId;

  @Prop({
    required: true,
    type: String,
  })
  ContactName: string;

  @Prop({ required: true, type: Number })
  Price: number;

  @Prop({ required: true, type: Number })
  Amount: number;

  @Prop({
    required: function () {
      return this.Remark !== null;
    },
    type: String,
  })
  Remark: string;
}

const DetailSchema = SchemaFactory.createForClass(Detail);

@Schema({
  collection: 'PurchaseOrder',
  id: false,
  versionKey: false,
})
export class PurchaseOrder {
  @Prop({ type: Date, required: true })
  PurchaseDate: Date;

  @Prop({ type: [DetailSchema], required: true })
  Details: Detail[];

  @Prop({ required: true, type: Number })
  TotalPrice: number;

  @Prop({
    required: function () {
      return this.Remark !== null;
    },
    type: String,
  })
  Remark: string;
}

export const PurchaseOrderSchema = SchemaFactory.createForClass(PurchaseOrder);

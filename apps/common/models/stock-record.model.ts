import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type StockRecordDocument = StockRecord & Document;

@Schema({ _id: false })
class Detail {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  WarehouseId: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, required: true })
  WarehouseName: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  WarehouseSkuId: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, required: true })
  WarehouseSkuName: string;

  @Prop({ type: Number, required: true })
  OriginStock: number;

  @Prop({ type: Number, required: true })
  IncreaseStock: number;

  @Prop({ type: Number, required: true })
  ResultStock: number;
}

const DetailSchema = SchemaFactory.createForClass(Detail);

@Schema({
  collection: 'StockRecord',
  id: false,
  versionKey: false,
})
export class StockRecord {
  @Prop({ type: String, required: true })
  Type: string;

  @Prop({ type: Date, required: true })
  RecordDate: Date;

  @Prop({ type: DetailSchema, required: true })
  Detail: Detail;

  @Prop({
    type: String,
    required: function () {
      return this.Remark !== null;
    },
  })
  Remark: string;
}

export const StockRecordSchema = SchemaFactory.createForClass(StockRecord);

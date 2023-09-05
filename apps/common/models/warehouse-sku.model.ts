import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type WarehouseSkuDocument = WarehouseSku & Document;

@Schema({ _id: false })
class SkuOption {
  @Prop({ type: String, required: true })
  OptionName: string;

  @Prop({ type: String, required: true })
  OptionValue: string;
}

const SkuOptionSchema = SchemaFactory.createForClass(SkuOption);

@Schema({
  collection: 'WarehouseSku',
  id: false,
  versionKey: false,
})
export class WarehouseSku {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  WarehouseId: MongooseSchema.Types.ObjectId;

  @Prop({ type: [SkuOptionSchema], required: true })
  SkuOptions: SkuOption[];

  @Prop({ type: Number, required: true, min: 0 })
  Stock: number;

  // 用於 WarehouseSkus 內部排序
  @Prop({ type: Number, required: true, min: 0 })
  Index: number;
}

export const WarehouseSkuSchema = SchemaFactory.createForClass(WarehouseSku);

WarehouseSkuSchema.virtual('WarehouseName', {
  ref: 'Warehouse',
  localField: 'WarehouseId',
  foreignField: '_id',
  justOne: true,
}).get((value) => {
  return value ? value.Name : null;
});

WarehouseSkuSchema.set('toJSON', { virtuals: true });

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CommoditySkuDocument = CommoditySku & Document;

@Schema({ _id: false })
class SkuOption {
  @Prop({ type: String, required: true })
  OptionName: string;

  @Prop({ type: String, required: true })
  OptionValue: string;
}

const SkuOptionSchema = SchemaFactory.createForClass(SkuOption);

@Schema({
  collection: 'CommoditySku',
  id: false,
  versionKey: false,
})
export class CommoditySku {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  CommodityId: MongooseSchema.Types.ObjectId;

  @Prop({ type: [SkuOptionSchema], required: true })
  SkuOptions: SkuOption[];

  @Prop({ type: Number, required: true, min: 0 })
  Stock: number;

  // 用於 CommoditySkus 內部排序
  @Prop({ type: Number, required: true, min: 0 })
  Index: number;
}

export const CommoditySkuSchema = SchemaFactory.createForClass(CommoditySku);

CommoditySkuSchema.virtual('CommodityName', {
  ref: 'Commodity',
  localField: 'CommodityId',
  foreignField: '_id',
  justOne: true,
}).get((value) => {
  return value ? value.Name : null;
});

CommoditySkuSchema.set('toJSON', { virtuals: true });

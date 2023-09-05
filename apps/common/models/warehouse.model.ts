import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WarehouseDocument = Warehouse & Document;

@Schema({ _id: false })
class Option {
  @Prop({ type: String, required: true })
  Name: string;

  @Prop({ type: [String], required: true })
  Items: string[];
}

const OptionSchema = SchemaFactory.createForClass(Option);

@Schema({
  collection: 'Warehouse',
  id: false,
  versionKey: false,
})
export class Warehouse {
  @Prop({ type: String, require: true })
  TypeId: string;

  @Prop({ type: String, require: true, unique: true })
  Name: string;

  @Prop({ type: [OptionSchema], required: true })
  Options: Option[];
}

export const WarehouseSchema = SchemaFactory.createForClass(Warehouse);

WarehouseSchema.virtual('TypeName', {
  ref: 'CommonData',
  localField: 'TypeId',
  foreignField: 'Id',
  match: { Category: 'WarehouseType' },
  justOne: true,
}).get((value) => {
  return value ? value.Name : null;
});

WarehouseSchema.virtual('Skus', {
  ref: 'WarehouseSku',
  localField: '_id',
  foreignField: 'WarehouseId',
  options: { sort: { Index: 1 } },
}).get((value) => {
  return value ? value : [];
});

WarehouseSchema.set('toJSON', { virtuals: true });

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { CommodityStatus } from '../enums/commodity-status';

export type CommodityDocument = Commodity & Document;

@Schema({ _id: false })
class Content {
  @Prop({ required: true, type: String })
  type: string;

  @Prop({ type: Object })
  attrs?: object;

  @Prop({ type: String })
  text?: string;
}

const ContentSchema = SchemaFactory.createForClass(Content);

ContentSchema.add(
  new MongooseSchema(
    {
      content: { type: [ContentSchema] },
    },
    { _id: false },
  ),
);

@Schema({ _id: false })
class Option {
  @Prop({ type: String, required: true })
  Name: string;

  @Prop({ type: [String], required: true })
  Items: string[];
}

const OptionSchema = SchemaFactory.createForClass(Option);

@Schema({
  collection: 'Commodity',
  timestamps: {
    createdAt: 'CreateDate',
    updatedAt: 'UpdateDate',
  },
  id: false,
  versionKey: false,
})
export class Commodity {
  @Prop({ type: String, required: true, unique: true })
  UrlTitle: string;

  @Prop({ type: String, required: true })
  Title: string;

  @Prop({ type: [String], required: true })
  TagIds: string[];

  @Prop({ type: String, required: true })
  TypeId: string;

  @Prop({ type: ContentSchema, required: true })
  Content: Content;

  @Prop({
    type: String,
    required: function () {
      return this.Summary !== null;
    },
  })
  Summary: string;

  @Prop({ type: [MongooseSchema.Types.ObjectId], required: true })
  ImageIds: MongooseSchema.Types.ObjectId[];

  @Prop({ enum: CommodityStatus, type: Number, required: true })
  StatusId: number;

  @Prop({ type: [OptionSchema], required: true })
  Options: Option[];
}

export const CommoditySchema = SchemaFactory.createForClass(Commodity);

CommoditySchema.virtual('TypeName', {
  ref: 'CommonData',
  localField: 'TypeId',
  foreignField: 'Id',
  match: { Category: 'CommodityType' },
  justOne: true,
}).get((value) => {
  return value ? value.Name : null;
});

CommoditySchema.virtual('TagNames', {
  ref: 'CommonData',
  localField: 'TagIds',
  foreignField: 'Id',
  match: { Category: 'Tag' },
}).get((value) => {
  return value ? value.map((tag) => tag.Name) : [];
});

CommoditySchema.virtual('Images', {
  ref: 'Image',
  localField: 'ImageIds',
  foreignField: '_id',
  match: { Type: 'Commodity' },
}).get((value) => {
  return value ? value : [];
});

CommoditySchema.set('toJSON', { virtuals: true });

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ArticleStatus } from '../enums/article-status';

export type ArticleDocument = Article & Document;

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

@Schema({
  collection: 'Article',
  timestamps: {
    createdAt: 'CreateDate',
    updatedAt: 'UpdateDate',
  },
  id: false,
  versionKey: false,
})
export class Article {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  UrlTitle: string;

  @Prop({
    type: String,
    required: true,
  })
  Title: string;

  @Prop({ type: [String], required: true })
  TagIds: string[];

  @Prop({
    type: String,
    required: true,
  })
  TypeId: string;

  @Prop({
    type: [ContentSchema],
    required: true,
  })
  Content: Content[];

  @Prop({
    type: String,
    required: function () {
      return this.Summary !== null;
    },
  })
  Summary: string;

  @Prop({ type: [MongooseSchema.Types.ObjectId], required: true })
  ImageIds: MongooseSchema.Types.ObjectId[];

  @Prop({ enum: ArticleStatus, type: Number, required: true })
  StatusId: number;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

ArticleSchema.virtual('TypeName', {
  ref: 'CommonData',
  localField: 'TypeId',
  foreignField: 'Id',
  match: { Category: 'ArticleType' },
  justOne: true,
}).get((value) => {
  return value ? value.Name : null;
});

ArticleSchema.virtual('TagNames', {
  ref: 'CommonData',
  localField: 'TagIds',
  foreignField: 'Id',
  match: { Category: 'Tag' },
}).get((value) => {
  return value ? value.map((tag) => tag.Name) : [];
});

ArticleSchema.virtual('Images', {
  ref: 'Image',
  localField: 'ImageIds',
  foreignField: '_id',
  match: { Type: 'Article' },
}).get((value) => {
  return value ? value : [];
});

ArticleSchema.set('toJSON', { virtuals: true });

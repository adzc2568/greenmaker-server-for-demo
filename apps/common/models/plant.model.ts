import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type PlantDocument = Plant & Document;

@Schema({ _id: false })
class Taxonomy {
  @Prop({
    required: function () {
      return this.Family !== null;
    },
    type: String,
    default: null,
  })
  Family: string;

  @Prop({
    required: function () {
      return this.Genus !== null;
    },
    type: String,
    default: null,
  })
  Genus: string;
}

const TaxonomySchema = SchemaFactory.createForClass(Taxonomy);

@Schema({ collection: 'Plant', id: false, versionKey: false })
export class Plant {
  @Prop({
    required: function () {
      return this.ScientificName !== null;
    },
    type: String,
  })
  ScientificName: string;

  @Prop({ required: true, type: String })
  BusinessName: string;

  @Prop({
    required: function () {
      return this.Description !== null;
    },
    type: String,
  })
  Description: string;

  @Prop({ required: true, type: TaxonomySchema })
  Taxonomy: Taxonomy;

  @Prop({ type: [MongooseSchema.Types.ObjectId], required: true })
  ImageIds: MongooseSchema.Types.ObjectId[];
}

export const PlantSchema = SchemaFactory.createForClass(Plant);

PlantSchema.virtual('Images', {
  ref: 'Image',
  localField: 'ImageIds',
  foreignField: '_id',
  match: { Type: 'Plant' },
}).get((value) => {
  return value ? value : [];
});

PlantSchema.set('toJSON', { virtuals: true });

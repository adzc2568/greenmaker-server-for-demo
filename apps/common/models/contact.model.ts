import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContactDocument = Contact & Document;

@Schema({ collection: 'Contact', id: false, versionKey: false })
export class Contact {
  @Prop({
    type: String,
    required: true,
  })
  Name: string;

  @Prop({
    type: String,
    required: function () {
      return this.Address !== null;
    },
  })
  Address: string;

  @Prop({
    type: String,
    required: function () {
      return this.Phone !== null;
    },
  })
  Phone: string;

  @Prop({
    type: String,
    required: function () {
      return this.Website !== null;
    },
  })
  Website: string;

  @Prop({
    type: String,
    required: function () {
      return this.Remark !== null;
    },
  })
  Remark: string;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);

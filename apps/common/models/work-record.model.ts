import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WorkRecordDocument = WorkRecord & Document;

@Schema({
  collection: 'WorkRecord',
  id: false,
  versionKey: false,
})
export class WorkRecord {
  @Prop({ type: Date, required: true })
  RecordDate: Date;

  @Prop({
    type: String,
    required: function () {
      return this.Content !== null;
    },
  })
  Content: string;

  @Prop({ type: [String], required: true })
  WorkEventIds: string[];
}

export const WorkRecordSchema = SchemaFactory.createForClass(WorkRecord);

WorkRecordSchema.virtual('WorkEventNames', {
  ref: 'CommonData',
  localField: 'WorkEventIds',
  foreignField: 'Id',
  match: { Category: 'WorkEvent' },
}).get((value) => {
  return value ? value.map((workEvent) => workEvent.Name) : [];
});

WorkRecordSchema.set('toJSON', { virtuals: true });

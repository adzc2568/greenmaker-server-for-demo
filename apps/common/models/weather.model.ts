import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WeatherDocument = Weather & Document;

// fetch from https://e-service.cwb.gov.tw/HistoryDataQuery/index.jsp

@Schema({ _id: false })
class WeatherData {
  @Prop({ type: Number, required: true })
  ObsTime: number; // 觀測時間

  @Prop({ type: Number, required: true })
  Temperature: number; // 露點溫度

  @Prop({ type: Number, required: true })
  RH: number; // 相對溼度

  @Prop({ type: Number, required: true })
  WS: number; // 風速

  @Prop({ type: Number, required: true })
  Precp: number; // 降水量

  @Prop({ type: Number, required: true })
  PrecpHour: number; // 降水時數

  @Prop({ type: Number, required: true })
  SunShine: number; // 日照時數

  @Prop({ type: Number, required: true })
  GloblRad: number; // 全天空日射量
}

const WeatherDataSchema = SchemaFactory.createForClass(WeatherData);

@Schema({
  collection: 'Weather',
  id: false,
  versionKey: false,
})
export class Weather {
  @Prop({ type: Date, required: true, unique: true })
  Date: Date;

  @Prop({ type: [WeatherDataSchema], required: true })
  WeatherDatas: WeatherData[];
}

export const WeatherSchema = SchemaFactory.createForClass(Weather);

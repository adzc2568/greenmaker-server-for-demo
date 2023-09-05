import {
  IsString,
  IsNumber,
  IsDateString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QueryDto } from '../../../common/dto/query.dto';

export class WeatherQueryDto extends QueryDto {
  @IsDateString()
  DateStart: string;

  @IsDateString()
  DateEnd: string;
}

class WeatherDataDto {
  @IsNumber()
  @Type(() => Number)
  ObsTime: number; // 觀測時間

  @IsNumber()
  @Type(() => Number)
  Temperature: number; // 露點溫度

  @IsNumber()
  @Type(() => Number)
  RH: number; // 相對溼度

  @IsNumber()
  @Type(() => Number)
  WS: number; // 風速

  @IsNumber()
  @Type(() => Number)
  SunShine: number; // 日照時數

  @IsNumber()
  @Type(() => Number)
  GloblRad: number; // 全天空日射量

  @IsNumber()
  @Type(() => Number)
  Precp: number; // 降水量

  @IsNumber()
  @Type(() => Number)
  PrecpHour: number; // 降水時數
}

export class CreateWeatherDto {
  @IsDateString()
  @Type(() => Date)
  Date: Date;

  @IsArray()
  @ValidateNested()
  @Type(() => WeatherDataDto)
  WeatherDatas: WeatherDataDto[];
}

export class UpdateWeatherDto extends CreateWeatherDto {
  @IsString()
  _id: string;
}

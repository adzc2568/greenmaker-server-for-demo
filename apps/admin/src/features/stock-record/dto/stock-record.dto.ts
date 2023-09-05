import {
  IsString,
  IsDateString,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QueryDto } from '../../../common/dto/query.dto';
import { Types } from 'mongoose';

export class StockRecordQueryDto extends QueryDto {
  // @IsOptional()
  // @IsString()
  // Type?: string;

  // @IsOptional()
  // @IsString()
  // Name?: string;
}

import {
  IsString,
  IsArray,
  IsDateString,
  IsDate,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QueryDto } from '../../../common/dto/query.dto';

export class WorkRecordQueryDto extends QueryDto {
  @IsDateString()
  DateStart: string;

  @IsDateString()
  DateEnd: string;
}

export class CreateWorkRecordDto {
  @IsDate()
  @Type(() => Date)
  RecordDate: Date;

  @IsString()
  @ValidateIf((value) => value === null)
  Content: string;

  @IsArray()
  @IsString({ each: true })
  WorkEventIds: string[];
}

export class UpdateWorkRecordDto extends CreateWorkRecordDto {
  @IsString()
  _id: string;
}

import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QueryDto } from '../../../common/dto/query.dto';

export class IncomeQueryDto extends QueryDto {
  @IsOptional()
  @IsDateString()
  Date?: string;
}

export class CreateIncomeDto {
  @IsDateString()
  Date: string;

  @IsString()
  ItemName: string;

  @IsNumber()
  @Type(() => Number)
  Cost: number;

  @IsNumber()
  @Type(() => Number)
  Amount: number;

  @IsString()
  @ValidateIf((value) => value === null)
  Remark: string;
}

export class UpdateIncomeDto extends CreateIncomeDto {
  @IsString()
  _id: string;
}

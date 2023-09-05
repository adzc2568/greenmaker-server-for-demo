import {
  IsString,
  ValidateNested,
  IsArray,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SkuOption {
  @IsString()
  OptionName: string;

  @IsString()
  OptionValue: string;
}

export class CreateWarehouseSkuDto {
  @IsArray()
  @ValidateNested()
  @Type(() => SkuOption)
  SkuOptions: SkuOption[];

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  Stock: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  Index: number;
}

export class UpdateWarehouseSkuDto extends CreateWarehouseSkuDto {
  @IsOptional()
  @IsString()
  _id?: string;

  @IsOptional()
  @IsString()
  WarehouseId?: string;
}

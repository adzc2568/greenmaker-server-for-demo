import {
  IsString,
  ValidateNested,
  IsArray,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SkuOption {
  @IsString()
  OptionName: string;

  @IsString()
  OptionValue: string;
}

export class CreateCommoditySkuDto {
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

export class UpdateCommoditySkuDto extends CreateCommoditySkuDto {
  @IsString()
  _id: string;

  @IsString()
  CommodityId: string;

  CommodityName: string;
}

import {
  IsOptional,
  IsString,
  IsArray,
  ValidateIf,
  IsObject,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class Content {
  @IsString()
  type: string;

  @IsOptional()
  @IsObject()
  attributes?: object;
}

export class CommodityDto {
  @IsString()
  UrlTitle: string;

  @IsString()
  Title: string;

  @IsArray()
  @IsString({ each: true })
  TagIds: string[];

  @IsString()
  TypeId: string;

  @IsArray()
  @ValidateNested()
  @Type(() => Content)
  Contents: Content[];

  @IsString()
  @ValidateIf((value) => value === null)
  Summary: string;

  @IsString()
  @ValidateIf((value) => value === null)
  HTML: string;

  ImageIds: string[];
}

export class CommodityWithIdDto extends CommodityDto {
  @IsString()
  _id: string;
}

class SkuOption {
  @IsString()
  Name: string;

  @IsString()
  Value: string;

  @IsNumber()
  Layer: number;

  @IsOptional()
  @IsNumber()
  N?: number;
}

class Sku {
  @IsArray()
  @ValidateNested()
  @Type(() => SkuOption)
  Options: SkuOption[];

  @IsNumber()
  Price: number;

  @IsNumber()
  Stock: number;
}

class Option {
  @IsString()
  Type: string;

  @IsString()
  Name: string;

  @IsString()
  Label: string;

  @IsArray()
  @IsString({ each: true })
  Value: string[];
}

export class SkusAndOptionsDto {
  @IsString()
  _id: string;

  @IsArray()
  @ValidateNested()
  @Type(() => Sku)
  Skus: Sku[];

  @IsArray()
  @ValidateNested()
  @Type(() => Option)
  Options: Option[];
}

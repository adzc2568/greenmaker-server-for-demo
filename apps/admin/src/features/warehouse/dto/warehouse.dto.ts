import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QueryDto } from '../../../common/dto/query.dto';
import {
  CreateWarehouseSkuDto,
  UpdateWarehouseSkuDto,
} from '../../warehouse-sku/dto/warehouse-sku.dto';

export class WarehouseQueryDto extends QueryDto {
  @IsOptional()
  @IsString()
  TypeId?: string;

  @IsOptional()
  @IsString()
  Name?: string;
}

class OptionDto {
  @IsString()
  Name: string;

  @IsArray()
  @IsString({ each: true })
  Items: string[];
}

export class CreateWarehouseDto {
  @IsString()
  TypeId: string;

  @IsString()
  Name: string;

  @IsArray()
  @ValidateNested()
  @Type(() => CreateWarehouseSkuDto)
  Skus: CreateWarehouseSkuDto[];

  @IsArray()
  @ValidateNested()
  @Type(() => OptionDto)
  Options: OptionDto[];
}

export class UpdateWarehouseDto extends CreateWarehouseDto {
  @IsString()
  _id: string;

  @IsArray()
  @ValidateNested()
  @Type(() => UpdateWarehouseSkuDto)
  Skus: UpdateWarehouseSkuDto[];
}

class StockMoveItemDto {
  @IsString()
  FromSkuId: string;

  @IsString()
  ToSkuId: string;

  @IsNumber()
  @Type(() => Number)
  Amount: number;
}

export class StockMoveDto {
  @IsArray()
  @ValidateNested()
  @Type(() => StockMoveItemDto)
  StockMoveItems: StockMoveItemDto[];
}

export class StockUpdateSkuDto {
  @IsString()
  _id: string;

  @IsNumber()
  @Type(() => Number)
  Stock: number;

  @IsString()
  Remark: string;
}

export class StockUpdateDto {
  @IsString()
  _id: string;

  @IsArray()
  @ValidateNested()
  @Type(() => StockUpdateSkuDto)
  Skus: StockUpdateSkuDto[];
}

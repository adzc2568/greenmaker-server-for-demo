import {
  IsString,
  IsDateString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  ValidateIf,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { QueryDto } from '../../../common/dto/query.dto';
import { Types } from 'mongoose';

export class PurchaseOrderQueryDto extends QueryDto {
  @IsOptional()
  @IsString()
  Type?: string;

  @IsOptional()
  @IsString()
  Name?: string;
}

class Detail {
  @IsString()
  WarehouseId: string;

  @IsString()
  WarehouseName: string;

  @IsString()
  SkuId: string;

  @IsString()
  SkuName: string;

  @IsString()
  ContactId: string;

  @IsString()
  ContactName: string;

  @IsNumber()
  @Type(() => Number)
  Price: number;

  @IsNumber()
  @Type(() => Number)
  Amount: number;

  @IsString()
  @ValidateIf((value) => value === null)
  Remark: string;
}

export class PurchaseOrderDto {
  @IsDateString()
  PurchaseDate: Date;

  @IsArray()
  @ValidateNested()
  @Type(() => Detail)
  Details: Detail[];

  @IsNumber()
  @Type(() => Number)
  TotalPrice: number;

  @IsString()
  @ValidateIf((value) => value === null)
  Remark: string;
}

export class PurchaseOrderWithIdDto extends PurchaseOrderDto {
  @IsString()
  readonly _id: string;
}

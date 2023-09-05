import {
  IsString,
  IsNumber,
  IsOptional,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ImageDataDto {
  @IsString()
  BasePath: string;
}

export class CropImageDto {
  @IsString()
  _id: string;

  @IsString()
  Type: string;

  @IsObject()
  @ValidateNested()
  @Type(() => ImageDataDto)
  Origin: ImageDataDto;

  @IsNumber()
  @Type(() => Number)
  Top: number;

  @IsNumber()
  @Type(() => Number)
  Left: number;

  @IsNumber()
  @Type(() => Number)
  Width: number;

  @IsNumber()
  @Type(() => Number)
  Height: number;
}

export class UploadImageDto {
  @IsOptional()
  @IsString()
  ParentId?: string;

  @IsString()
  Type: string;
}

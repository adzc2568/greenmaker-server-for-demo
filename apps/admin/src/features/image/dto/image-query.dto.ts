import { IsString, IsInt, IsOptional } from 'class-validator';
import { QueryDto } from '../../../common/dto/query.dto';
import { Type } from 'class-transformer';

export class ImageQueryDto extends QueryDto {
  @IsOptional()
  @IsString()
  Path?: string;

  @IsOptional()
  @IsString()
  Type?: string;

  @IsOptional()
  @IsString()
  Description?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  Width?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  Height?: number;
}

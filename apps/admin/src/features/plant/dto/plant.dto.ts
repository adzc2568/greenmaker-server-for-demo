import {
  IsString,
  IsObject,
  ValidateNested,
  ValidateIf,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QueryDto } from '../../../common/dto/query.dto';

class TaxonomyDto {
  @IsString()
  @ValidateIf((value) => value === null)
  Family: string;

  @IsString()
  @ValidateIf((value) => value === null)
  Genus: string;
}

class ImageDto {
  @IsString()
  _id: string;

  @IsString()
  Name: string;

  @IsString()
  @ValidateIf((value) => value === null)
  Description: string;
}

export class BasePlantDto {
  @IsString()
  @ValidateIf((value) => value === null)
  ScientificName: string;

  @IsString()
  BusinessName: string;

  @IsString()
  @ValidateIf((value) => value === null)
  Description: string;

  @IsObject()
  @ValidateNested()
  @Type(() => TaxonomyDto)
  Taxonomy: TaxonomyDto;

  @IsArray()
  @ValidateNested()
  @Type(() => ImageDto)
  Images: ImageDto[];
}

export class PlantWithIdDto extends BasePlantDto {
  @IsString()
  _id: string;
}

export class PlantQueryDto extends QueryDto {
  @IsOptional()
  @IsString()
  ScientificName?: string;

  @IsOptional()
  @IsString()
  BusinessName?: string;
}

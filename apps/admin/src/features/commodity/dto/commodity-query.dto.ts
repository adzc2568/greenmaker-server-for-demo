import { IsString, IsOptional } from 'class-validator';
import { QueryDto } from '../../../common/dto/query.dto';
export class CommodityQueryDto extends QueryDto {
  @IsOptional()
  @IsString()
  public readonly Title?: string;
}

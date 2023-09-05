import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryDto {
  @ApiPropertyOptional({ description: '要略過的資料數目' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  public readonly skip?: number;

  @ApiPropertyOptional({ description: '限制取得的資料數目上限' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  public readonly limit?: number;
}

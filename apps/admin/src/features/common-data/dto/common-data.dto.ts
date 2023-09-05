import { IsString, IsOptional } from 'class-validator';
import { QueryDto } from '../../../common/dto/query.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CommonDataQueryDto extends QueryDto {
  @ApiPropertyOptional({ type: String, description: '類別' })
  @IsOptional()
  @IsString()
  Category?: string;
}

export class CreateCommonDataDto {
  @ApiProperty({ type: String, description: '類別' })
  @IsString()
  Category: string;

  @ApiProperty({ type: String, description: '代碼' })
  @IsString()
  Id: string;

  @ApiProperty({ type: String, description: '名稱' })
  @IsString()
  Name: string;

  @ApiPropertyOptional({ type: String, description: 'CommonData _id' })
  @IsOptional()
  @IsString()
  ParentId: string;
}

export class UpdateCommonDataDto extends CreateCommonDataDto {
  @ApiProperty({ type: String, description: '_id' })
  @IsString()
  _id: string;
}

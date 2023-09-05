import { IsString, IsOptional } from 'class-validator';
import { QueryDto } from '../../../common/dto/query.dto';

export class UserQueryDto extends QueryDto {
  @IsOptional()
  @IsString()
  Account?: string;
}

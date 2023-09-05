import { IsString, ValidateIf, IsOptional } from 'class-validator';
import { QueryDto } from '../../../common/dto/query.dto';

export class ContactQueryDto extends QueryDto {
  @IsOptional()
  @IsString()
  Name?: string;
}

export class ContactDto {
  @IsString()
  Name: string;

  @IsString()
  @ValidateIf((value) => value === null)
  Address: string;

  @IsString()
  @ValidateIf((value) => value === null)
  Phone: string;

  @IsString()
  @ValidateIf((value) => value === null)
  Website: string;

  @IsString()
  @ValidateIf((value) => value === null)
  Remark: string;
}

export class ContactWithIdDto extends ContactDto {
  @IsString()
  readonly _id: string;
}

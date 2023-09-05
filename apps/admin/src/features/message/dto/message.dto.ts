import { IsString, IsOptional } from 'class-validator';
import { QueryDto } from '../../../common/dto/query.dto';

export class MessageQueryDto extends QueryDto {
  @IsOptional()
  @IsString()
  ConversationId?: string;
}

export class CreateMessageDto {
  @IsString()
  ConversationId: string;

  @IsString()
  SenderId: string;

  @IsString()
  Content: string;
}

export class UpdateMessageDto extends CreateMessageDto {
  @IsString()
  _id: string;
}

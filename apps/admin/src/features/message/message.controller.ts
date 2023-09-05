import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Param,
  Body,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  MessageQueryDto,
  CreateMessageDto,
  UpdateMessageDto,
} from './dto/message.dto';
import { MessageService } from './message.service';

@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor(private readonly MessageService: MessageService) {}
  @Get()
  async getList(@Query() query: MessageQueryDto) {
    const { data, error } = await this.MessageService.getList(query);
    if (data) return data;
    if (error) throw error;
  }

  @Get('latest-and-not-readed-message')
  async getLatestAndNotReadedMessage(@Query() query: MessageQueryDto) {
    const { data, error } =
      await this.MessageService.getLatestAndNotReadedMessage(query);
    if (data) return data;
    if (error) throw error;
  }

  @Get(':_id')
  async getItem(_id: string) {
    const { data, error } = await this.MessageService.getItem(_id);
    if (data) return data;
    if (error) throw error;
  }

  @Post()
  async createItem(@Body() body: CreateMessageDto) {
    const { data, error } = await this.MessageService.createItem(body);
    if (data) return data;
    if (error) throw error;
  }

  @Put()
  async updateItem(@Body() body: UpdateMessageDto) {
    const { data, error } = await this.MessageService.updateItem(body);
    if (data) return data;
    if (error) throw error;
  }

  @Delete(':_id')
  async deleteItem(@Param('_id') _id: string) {
    const { data, error } = await this.MessageService.deleteItem(_id);
    if (data) return data;
    if (error) throw error;
  }
}

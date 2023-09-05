import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Param,
  Body,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import {
  ContactQueryDto,
  ContactDto,
  ContactWithIdDto,
} from './dto/contact.dto';

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly ContactService: ContactService) {}

  @Get()
  async getList(
    @Query(ValidationPipe)
    query: ContactQueryDto,
  ) {
    const { data, error } = await this.ContactService.getList(query);
    if (data) return data;
    if (error) throw error;
  }

  @Get(':_id')
  async getItem(@Param('_id') _id: string) {
    const { data, error } = await this.ContactService.getItem(_id);
    if (data) return data;
    if (error) throw error;
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createItem(@Body() body: ContactDto) {
    const { data, error } = await this.ContactService.createItem(body);
    if (data) return data;
    if (error) throw error;
  }

  @Put()
  @UsePipes(ValidationPipe)
  async updateItem(@Body() body: ContactWithIdDto) {
    const { data, error } = await this.ContactService.updateItem(body);
    if (data) return data;
    if (error) throw error;
  }

  @Delete(':_id')
  async deleteItem(@Param('_id') _id: string) {
    const { data, error } = await this.ContactService.deleteItem(_id);
    if (data) return data;
    if (error) throw error;
  }
}

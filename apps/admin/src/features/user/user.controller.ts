import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserQueryDto } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly UserService: UserService) {}
  @Get()
  async getList(@Query() query: UserQueryDto) {
    const { data, error } = await this.UserService.getList(query);
    if (data) return data;
    if (error) throw error;
  }

  @Get(':_id')
  async getItem(_id: string) {
    const { data, error } = await this.UserService.getItem(_id);
    if (data) return data;
    if (error) throw error;
  }

  @Post()
  async createItem(@Body() body) {
    const { data, error } = await this.UserService.createItem(body);
    if (data) return data;
    if (error) throw error;
  }
}

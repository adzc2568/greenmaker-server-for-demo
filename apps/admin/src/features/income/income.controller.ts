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
  IncomeQueryDto,
  CreateIncomeDto,
  UpdateIncomeDto,
} from './dto/income.dto';
import { IncomeService } from './income.service';

@ApiTags('income')
@Controller('income')
export class IncomeController {
  constructor(private readonly IncomeService: IncomeService) {}
  @Get()
  async getList(@Query() query: IncomeQueryDto) {
    const { data, error } = await this.IncomeService.getList(query);
    if (data) return data;
    if (error) throw error;
  }

  @Get(':_id')
  async getItem(_id: string) {
    const { data, error } = await this.IncomeService.getItem(_id);
    if (data) return data;
    if (error) throw error;
  }

  @Post()
  async createItem(@Body() body: CreateIncomeDto) {
    const { data, error } = await this.IncomeService.createItem(body);
    if (data) return data;
    if (error) throw error;
  }

  @Put()
  async updateItem(@Body() body: UpdateIncomeDto) {
    const { data, error } = await this.IncomeService.updateItem(body);
    if (data) return data;
    if (error) throw error;
  }

  @Delete(':_id')
  async deleteItem(@Param('_id') _id: string) {
    const { data, error } = await this.IncomeService.deleteItem(_id);
    if (data) return data;
    if (error) throw error;
  }
}

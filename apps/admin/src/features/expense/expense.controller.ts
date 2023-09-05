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
  ExpenseQueryDto,
  CreateExpenseDto,
  UpdateExpenseDto,
} from './dto/expense.dto';
import { ExpenseService } from './expense.service';
import { MongoQuery, MongoQueryModel } from 'nest-mongo-query-parser';

@ApiTags('expense')
@Controller('expense')
export class ExpenseController {
  constructor(private readonly ExpenseService: ExpenseService) {}
  @Get()
  async getList(@MongoQuery() query: MongoQueryModel) {
    const { data, error } = await this.ExpenseService.getList(query);
    if (data) return data;
    if (error) throw error;
  }

  @Get(':_id')
  async getItem(_id: string) {
    const { data, error } = await this.ExpenseService.getItem(_id);
    if (data) return data;
    if (error) throw error;
  }

  @Post()
  async createItem(@Body() body: CreateExpenseDto) {
    const { data, error } = await this.ExpenseService.createItem(body);
    if (data) return data;
    if (error) throw error;
  }

  @Put()
  async updateItem(@Body() body: UpdateExpenseDto) {
    const { data, error } = await this.ExpenseService.updateItem(body);
    if (data) return data;
    if (error) throw error;
  }

  @Delete(':_id')
  async deleteItem(@Param('_id') _id: string) {
    const { data, error } = await this.ExpenseService.deleteItem(_id);
    if (data) return data;
    if (error) throw error;
  }
}

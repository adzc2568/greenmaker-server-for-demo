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
import { WarehouseService } from './warehouse.service';
import {
  CreateWarehouseDto,
  UpdateWarehouseDto,
  StockMoveDto,
  StockUpdateDto,
} from './dto/warehouse.dto';
import { errorHandler } from 'common/methods/error-handler';
import { MongoQuery, MongoQueryModel } from 'nest-mongo-query-parser';

@ApiTags('warehouse')
@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly WarehouseService: WarehouseService) {}

  @Get()
  async getList(
    @MongoQuery()
    query: MongoQueryModel,
  ) {
    const { data, error } = await this.WarehouseService.getList(query);
    if (data) return data;
    if (error) throw errorHandler(error);
  }

  @Get(':_id')
  async getItem(@Param('_id') _id) {
    const { data, error } = await this.WarehouseService.getItem(_id);
    if (data) return data;
    if (error) throw errorHandler(error);
  }

  @Post()
  async createItem(@Body() body: CreateWarehouseDto) {
    const { data, error } = await this.WarehouseService.createItem(body);
    if (data) return data;
    if (error) throw errorHandler(error);
  }

  @Put()
  async updateItem(@Body() body: UpdateWarehouseDto) {
    const { data, error } = await this.WarehouseService.updateItem(body);
    if (data) return data;
    if (error) throw errorHandler(error);
  }

  @Delete(':_id')
  async deleteItem(@Param('_id') _id) {
    const { data, error } = await this.WarehouseService.deleteItem(_id);
    if (data) return data;
    if (error) throw errorHandler(error);
  }

  @Post('stock-move')
  async stockMove(@Body() body: StockMoveDto) {
    const { data, error } = await this.WarehouseService.stockMove(body);
    if (data) return data;
    if (error) throw errorHandler(error);
  }

  @Put('stock-update')
  async stockUpdate(@Body() body: StockUpdateDto) {
    const { data, error } = await this.WarehouseService.stockUpdate(body);
    if (data) return data;
    if (error) throw errorHandler(error);
  }
}

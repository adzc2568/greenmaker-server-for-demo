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
import { PurchaseOrderService } from './purchase-order.service';
import {
  PurchaseOrderQueryDto,
  PurchaseOrderDto,
  PurchaseOrderWithIdDto,
} from './dto/purchase-order.dto';
import { errorHandler } from 'common/methods/error-handler';

@ApiTags('purchase-order')
@Controller('purchase-order')
export class PurchaseOrderController {
  constructor(private readonly PurchaseOrderService: PurchaseOrderService) {}

  @Get()
  async getList(
    @Query(
      new ValidationPipe({
        transform: true,
      }),
    )
    query: PurchaseOrderQueryDto,
  ) {
    const { data, error } = await this.PurchaseOrderService.getList(query);
    if (data) return data;
    if (error) throw errorHandler(error);
  }

  @Get(':_id')
  async getItem(@Param('_id') _id: string) {
    const { data, error } = await this.PurchaseOrderService.getItem(_id);
    if (data) return data;
    if (error) throw errorHandler(error);
  }

  @Post()
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  async createItem(@Body() body: PurchaseOrderDto) {
    const { data, error } = await this.PurchaseOrderService.createItem(body);
    if (data) return data;
    if (error) throw errorHandler(error);
  }

  @Put()
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  async updateItem(@Body() body: PurchaseOrderWithIdDto) {
    const { data, error } = await this.PurchaseOrderService.updateItem(body);
    if (data) return data;
    if (error) throw errorHandler(error);
  }

  // @Delete(':_id')
  // async deleteItem(@Param('_id') _id: string) {
  //   const { data, error } = await this.PurchaseOrderService.deleteItem(_id);
  //   if (data) return data;
  //   if (error) throw errorHandler(error);
  // }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommodityService } from './commodity.service';
import {
  CommodityDto,
  CommodityWithIdDto,
} from './dto/commodity.dto';
import { CommodityQueryDto } from './dto/commodity-query.dto';
import { CommodityStatus } from 'common/enums/commodity-status';

@ApiTags('commodity')
@Controller('commodity')
export class CommodityController {
  constructor(private readonly CommodityService: CommodityService) {}

  @Get()
  async getList(
    @Query(
      new ValidationPipe({
        transform: true,
      }),
    )
    query: CommodityQueryDto,
  ) {
    const { data, error } = await this.CommodityService.getList(query);
    if (data) return data;
    if (error) throw error;
  }

  @Get(':_id')
  async getItem(@Param('_id') _id: string) {
    const { data, error } = await this.CommodityService.getItem(_id);
    if (data) return data;
    if (error) throw error;
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createItem(@Body() body: CommodityDto) {
    const { data, error } = await this.CommodityService.createItem(body);
    if (data) return data;
    if (error) throw error;
  }

  @Put()
  @UsePipes(ValidationPipe)
  async updateItem(@Body() body: CommodityWithIdDto) {
    const { data, error } = await this.CommodityService.updateItem(body);
    if (data) return data;
    if (error) throw error;
  }

  @Delete(':_id')
  async deleteItem(@Param('_id') _id: string) {
    const { data, error } = await this.CommodityService.deleteItem(_id);
    if (data) return data;
    if (error) throw error;
  }

  @Post('launched/:_id')
  async launched(@Param('_id') _id: string) {
    const { data, error } = await this.CommodityService.statusChange({
      _id,
      StatusId: CommodityStatus.launched,
    });
    if (data) return data;
    if (error) throw error;
  }

  @Post('unlaunched/:_id')
  async unlaunched(@Param('_id') _id: string) {
    const { data, error } = await this.CommodityService.statusChange({
      _id,
      StatusId: CommodityStatus.unlaunched,
    });
    if (data) return data;
    if (error) throw error;
  }
}

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
import { ArticleStatusItems } from 'common/enums/article-status';
import { CommodityStatusItems } from 'common/enums/commodity-status';
import { CommonDataService } from './common-data.service';
import {
  CreateCommonDataDto,
  UpdateCommonDataDto,
} from './dto/common-data.dto';
import { MongoQuery, MongoQueryModel } from 'nest-mongo-query-parser';

@ApiTags('common-data')
@Controller('common-data')
export class CommonDataController {
  constructor(private readonly CommonDataService: CommonDataService) {}

  @Get()
  async getList(@MongoQuery() query: MongoQueryModel) {
    const { data, error } = await this.CommonDataService.getList(query);
    if (data) return data;
    if (error) throw error;
  }

  @Get(':_id')
  async getItem(_id: string) {
    const { data, error } = await this.CommonDataService.getItem(_id);
    if (data) return data;
    if (error) throw error;
  }

  @Post()
  async postItem(@Body() body: CreateCommonDataDto) {
    const { data, error } = await this.CommonDataService.postItem(body);
    if (data) return data;
    if (error) throw error;
  }

  @Put()
  async putItem(@Body() body: UpdateCommonDataDto) {
    const { data, error } = await this.CommonDataService.putItem(body);
    if (data) return data;
    if (error) throw error;
  }

  @Delete(':_id')
  async deleteItem(@Param('_id') _id: string) {
    const { data, error } = await this.CommonDataService.deleteItem(_id);
    if (data) return data;
    if (error) throw error;
  }
}

@ApiTags('common-data')
@Controller('list')
export class ListController {
  constructor(private readonly CommonDataService: CommonDataService) {}

  @Get('CommodityStatus')
  async getCommodityStatus() {
    return CommodityStatusItems;
  }

  @Get('ArticleStatus')
  async getArticleStatus() {
    return ArticleStatusItems;
  }

  @Get(':Category')
  async getListAll(@Param('Category') Category: string) {
    const { data, error } = await this.CommonDataService.getListAll(Category);
    if (data) return data;
    if (error) throw error;
  }
}

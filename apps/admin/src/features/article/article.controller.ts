import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ArticleService } from './article.service';
import {
  ArticleDto,
  ArticleWithIdDto,
} from './dto/article.dto';
import { ArticleStatus } from 'common/enums/article-status';
import { MongoQuery, MongoQueryModel } from 'nest-mongo-query-parser';

@ApiTags('article')
@Controller('article')
export class ArticleController {
  constructor(private readonly ArticleService: ArticleService) {}

  @Get()
  async getList(
    @MongoQuery()
    query: MongoQueryModel,
  ) {
    const { data, error } = await this.ArticleService.getList(query);
    if (data) return data;
    if (error) throw error;
  }

  @Get(':_id')
  async getItem(@Param('_id') _id: string) {
    const { data, error } = await this.ArticleService.getItem(_id);
    if (data) return data;
    if (error) throw error;
  }

  @Post()
  async createItem(@Body() body: ArticleDto) {
    const { data, error } = await this.ArticleService.createItem(body);
    if (data) return data;
    if (error) throw error;
  }

  @Put()
  async updateItem(@Body() body: ArticleWithIdDto) {
    const { data, error } = await this.ArticleService.updateItem(body);
    if (data) return data;
    if (error) throw error;
  }

  @Delete(':_id')
  async deleteItem(@Param('_id') _id: string) {
    const { data, error } = await this.ArticleService.deleteItem(_id);
    if (data) return data;
    if (error) throw error;
  }

  @Post('publish/:_id')
  async publish(@Param('_id') _id: string) {
    const { data, error } = await this.ArticleService.statusChange({
      _id,
      StatusId: ArticleStatus.published,
    });
    if (data) return data;
    if (error) throw error;
  }

  @Post('unpublish/:_id')
  async unpublish(@Param('_id') _id: string) {
    const { data, error } = await this.ArticleService.statusChange({
      _id,
      StatusId: ArticleStatus.unpublished,
    });
    if (data) return data;
    if (error) throw error;
  }
}

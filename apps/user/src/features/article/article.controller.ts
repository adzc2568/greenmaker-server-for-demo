import {
  Controller,
  Get,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleQueryDto } from '../../../../admin/src/features/article/dto/article.dto';

@Controller('article')
export class ArticleController {
  constructor(private readonly ArticleService: ArticleService) {}

  @Get()
  @UsePipes(ValidationPipe)
  async getList(
    @Query()
    query,
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
}

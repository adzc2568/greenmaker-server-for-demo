import {
  Module,
  Injectable,
  CacheInterceptor,
  ExecutionContext,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from 'common/models/article.model';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { trackBy } from 'common/methods/trackBy';

@Injectable()
class ArticleCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    return trackBy(context, '/api/article');
  }
}

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Article.name, schema: ArticleSchema }],
      'mrgreen',
    ),
  ],
  controllers: [ArticleController],
  providers: [ArticleCacheInterceptor, ArticleService],
})
export class ArticleModule {}

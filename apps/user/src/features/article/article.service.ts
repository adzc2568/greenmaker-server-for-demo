import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ArticleDocument } from 'common/models/article.model';
import { errorHandler } from 'common/methods/error-handler';
import { cloneDeep, omit } from 'lodash';
import { ArticleQueryDto } from 'admin/src/features/article/dto/article.dto';
import { ArticleStatus } from 'common/enums/article-status';
import { Article } from './types/article.type';
import { MongoQueryParser, MongoQueryModel } from 'nest-mongo-query-parser';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel('Article', 'mrgreen')
    private readonly ArticleModel: Model<ArticleDocument>,
  ) {}

  public async getList(query): Promise<{
    data?: { Items: Article[]; Count: number };
    error?: HttpException;
  }> {
    try {
      const find = this.ArticleModel.find({
        ...query.filter,
        StatusId: { $eq: ArticleStatus.published },
      });
      const count = cloneDeep(find);
      find
        .select({ CreateDate: false, UpdateDate: false })
        .sort(Object.assign(query.sort, { Date: -1 }))
        .skip(query.skip)
        .limit(query.limit)
        .populate('TypeName')
        .populate('TagNames')
        .populate('Images');

      const [Items, Count] = await Promise.all([
        find
          .exec()
          .then((documents) =>
            documents.map<Article>((document) => document.toJSON()),
          ),
        count.countDocuments(),
      ]);

      return {
        data: {
          Items,
          Count,
        },
      };
    } catch (error) {
      return { error: errorHandler(error) };
    }
  }

  public async getItem(
    _id: string,
  ): Promise<{ data?: Article; error?: HttpException }> {
    try {
      const find = this.ArticleModel.findById(_id);
      find
        .select({ CreateDate: false, UpdateDate: false })
        .populate('TypeName')
        .populate('TagNames')
        .populate('Images');
      const data: Article = (await find.exec()).toJSON();
      return { data };
    } catch (error) {
      return { error: errorHandler(error) };
    }
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateResult } from 'mongodb';
import { ArticleDocument } from 'common/models/article.model';
import { ArticleStatus, ArticleStatusItems } from 'common/enums/article-status';
import { ImageService } from '../image/image.service';
import { Article } from './types/article.type';
import * as dayjs from 'dayjs';
import { cloneDeep } from 'lodash';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel('Article', 'mrgreen')
    private readonly ArticleModel: Model<ArticleDocument>,

    private readonly ImageService: ImageService,
  ) {}

  public async getList(query): Promise<{
    data?: { Items: Article[]; Count: number };
    error?: Error;
  }> {
    try {
      const find = this.ArticleModel.find(query.filter);
      const count = cloneDeep(find);
      find
        .select(query.select)
        .sort(query.sort)
        .skip(query.skip)
        .limit(query.limit)
        .populate('TypeName')
        .populate('TagNames')
        .populate('Images');

      const [Items, Count] = await Promise.all([
        find.exec().then((documents) =>
          documents.map((document) => {
            const item: Article = document.toJSON();
            item.CreateDate = dayjs(item.CreateDate).format();
            item.UpdateDate = dayjs(item.UpdateDate).format();
            item.StatusName = ArticleStatusItems.find(
              ({ Id }) => Id === item.StatusId,
            )?.Name;
            return item;
          }),
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
      return { error };
    }
  }

  public async getItem(_id): Promise<{ data?: Article; error?: Error }> {
    try {
      const find = this.ArticleModel.findById(_id);
      find.populate('TypeName');
      find.populate('TagNames');
      find.populate('Images');
      const data = await find.exec().then((document) => {
        const item: Article = document.toJSON();
        item.CreateDate = dayjs(item.CreateDate).format();
        item.UpdateDate = dayjs(item.UpdateDate).format();
        item.StatusName = ArticleStatusItems.find(
          ({ Id }) => Id === item.StatusId,
        )?.Name;
        return item;
      });

      return { data };
    } catch (error) {
      return { error };
    }
  }

  public async createItem(body): Promise<{ data?: Article; error?: Error }> {
    try {
      body.ImageIds = body.Images.map(({ _id }) => _id);
      body.StatusId = ArticleStatus.unpublished;
      const images = cloneDeep(body.Images);

      const document = await this.ArticleModel.create(body);

      const tasks = images
        .filter(({ Temp }) => Temp)
        .map((tempImage) =>
          this.ImageService.uploadTempImageToFirebase({
            ...tempImage,
            ParentId: document._id,
          }),
        );

      await Promise.all(tasks);

      await document.populate(['Images']);
      document.populated('Images');

      const data: Article = document.toJSON();

      return { data };
    } catch (error) {
      return { error };
    }
  }

  public async updateItem(body): Promise<{ data?: Article; error?: Error }> {
    try {
      body.ImageIds = body.Images.map(({ _id }) => _id);
      if (body.StatusId) body.StatusId = undefined;
      const images = cloneDeep(body.Images);

      const document = await this.ArticleModel.findByIdAndUpdate(
        body._id,
        { $set: body },
        { new: true },
      );

      const tasks = images
        .filter(({ Temp }) => Temp)
        .map((tempImage) =>
          this.ImageService.uploadTempImageToFirebase({
            ...tempImage,
            ParentId: document._id,
          }),
        );

      await Promise.all(tasks);

      await document.populate(['Images']);
      document.populated('Images');

      const data: Article = document.toJSON();

      return { data };
    } catch (error) {
      return { error };
    }
  }

  public async deleteItem(_id): Promise<{ data?: Article; error?: Error }> {
    try {
      const document = await this.ArticleModel.findByIdAndDelete(_id);
      const data: Article = document.toJSON();
      data.ImageIds.forEach((_id) => {
        this.ImageService.deleteImage(_id);
      });
      return { data };
    } catch (error) {
      return { error };
    }
  }

  public async statusChange(
    body,
  ): Promise<{ data?: UpdateResult; error?: Error }> {
    try {
      const document = await this.ArticleModel.updateOne(
        { _id: body._id },
        { $set: body },
      );
      return { data: document };
    } catch (error) {
      return { error };
    }
  }
}

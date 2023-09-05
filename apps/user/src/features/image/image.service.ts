import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImageDocument } from 'common/models/image.model';
import { errorHandler } from 'common/methods/error-handler';
import { cloneDeep, omit } from 'lodash';

@Injectable()
export class ImageService {
  private deleting: string | null = null;

  constructor(
    @InjectModel('Image', 'mrgreen')
    private readonly ImageModel: Model<ImageDocument>,
  ) {}

  public async getList(query): Promise<{
    data?: { Items: ImageDocument[]; Count: number };
    error?: HttpException;
  }> {
    try {
      const find = this.ImageModel.find();
      Object.entries(omit(query, ['skip', 'limit'])).forEach(([key, value]) => {
        find.where(key).equals(value);
      });
      const count = cloneDeep(find);

      find.skip(query.skip);
      find.limit(query.limit);

      const [document, Count] = await Promise.all([
        find.exec(),
        count.countDocuments(),
      ]);

      return {
        data: {
          Items: document,
          Count,
        },
      };
    } catch (error) {
      return { error: errorHandler(error) };
    }
  }

  public async getItem(_id): Promise<{
    data?: ImageDocument;
    error?: HttpException;
  }> {
    try {
      const find = this.ImageModel.findById(_id);
      const document = await find.exec();
      return { data: document };
    } catch (error) {
      return { error: errorHandler(error) };
    }
  }
}

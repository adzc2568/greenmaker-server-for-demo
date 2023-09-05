import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonDataDocument } from 'common/models/common-data.model';
import { cloneDeep, omit } from 'lodash';
import { CommonData } from 'admin/src/features/common-data/types/common-data.type';
import { CommonDataQueryDto } from 'admin/src/features/common-data/dto/common-data.dto';

@Injectable()
export class CommonDataService {
  constructor(
    @InjectModel('CommonData', 'mrgreen')
    private readonly CommonDataModel: Model<CommonDataDocument>,
  ) {}

  public async getList(query: CommonDataQueryDto): Promise<{
    data?: {
      Items: CommonData[];
      Count: number;
    };
    error?: Error;
  }> {
    try {
      const find = this.CommonDataModel.find();
      Object.entries(omit(query, ['skip', 'limit'])).forEach(([key, value]) => {
        find.where(key).regex(value);
      });
      const count = cloneDeep(find);

      find.skip(query.skip);
      find.limit(query.limit);

      const [Items, Count] = await Promise.all([
        find
          .exec()
          .then((documents) =>
            documents.map<CommonData>((document) => document.toJSON()),
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

  public async getItem(_id: string): Promise<{
    data?: CommonData;
    error?: Error;
  }> {
    try {
      const find = this.CommonDataModel.findById(_id);
      const data = await find
        .exec()
        .then((document): CommonData => document.toJSON());
      return { data };
    } catch (error) {
      return { error };
    }
  }

  public async getListAll(Category: string): Promise<{
    data?: CommonData[];
    error?: Error;
  }> {
    try {
      const find = this.CommonDataModel.find({ Category });
      const data = await find
        .exec()
        .then((documents) =>
          documents.map<CommonData>((document) => document.toJSON()),
        );

      return { data };
    } catch (error) {
      return { error };
    }
  }
}

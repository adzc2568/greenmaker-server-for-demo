import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonDataDocument } from 'common/models/common-data.model';
import { cloneDeep, omit } from 'lodash';
import { CommonData } from './types/common-data.type';
import { DeleteResult } from 'mongodb';
import {
  CreateCommonDataDto,
  UpdateCommonDataDto,
} from './dto/common-data.dto';
import { MongoQueryModel } from 'nest-mongo-query-parser';

@Injectable()
export class CommonDataService {
  constructor(
    @InjectModel('CommonData', 'mrgreen')
    private readonly CommonDataModel: Model<CommonDataDocument>,
  ) {}

  public async getList(query: MongoQueryModel): Promise<{
    data?: {
      Items: CommonData[];
      Count: number;
    };
    error?: Error;
  }> {
    try {
      const find = this.CommonDataModel.find(query.filter);
      const count = cloneDeep(find);
      find
        .select(query.select)
        .sort(query.sort)
        .skip(query.skip)
        .limit(query.limit);

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

  public async postItem(body: CreateCommonDataDto): Promise<{
    data?: CommonData;
    error?: Error;
  }> {
    try {
      const data = await this.CommonDataModel.create(body).then(
        (document): CommonData => document.toJSON(),
      );
      return { data };
    } catch (error) {
      return { error };
    }
  }

  public async putItem(body: UpdateCommonDataDto): Promise<{
    data?: CommonData;
    error?: Error;
  }> {
    try {
      const data = await this.CommonDataModel.findOneAndUpdate(
        { _id: body._id },
        { $set: body },
        { new: true },
      ).then((document): CommonData => document.toJSON());
      return { data };
    } catch (error) {
      return { error };
    }
  }

  public async deleteItem(_id: string): Promise<{
    data?: DeleteResult;
    error?: Error;
  }> {
    try {
      const document = await this.CommonDataModel.deleteOne({ _id });
      return { data: document };
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

import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateResult, DeleteResult } from 'mongodb';
import { StockRecordDocument } from 'common/models/stock-record.model';
import { cloneDeep, omit } from 'lodash';
import { StockRecord } from './types/stock-record.type';
import { Types } from 'mongoose';

@Injectable()
export class StockRecordService {
  constructor(
    @InjectModel('StockRecord', 'mrgreen')
    private readonly StockRecordModel: Model<StockRecordDocument>,
  ) {}

  public async getList(query): Promise<{
    data?: { Items: any[]; Count: number };
    error?: HttpException;
  }> {
    try {
      const find = this.StockRecordModel.find();
      find.sort({ RecordDate: -1 });
      Object.entries(omit(query, ['skip', 'limit'])).forEach(([key, value]) => {
        find.where(key).equals(value);
      });
      const count = cloneDeep(find);

      find.skip(query.skip);
      find.limit(query.limit);

      const [documents, Count] = await Promise.all([
        find.exec(),
        count.countDocuments(),
      ]);

      const Items = documents.map((document) => document.toJSON());

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
    data?: StockRecord;
    error?: HttpException;
  }> {
    try {
      const objectId = new Types.ObjectId(_id);
      const find = this.StockRecordModel.findById(objectId);
      const document = await find.exec();
      const data = document.toJSON() as StockRecord;
      return { data };
    } catch (error) {
      return { error };
    }
  }

  public async createItem(body): Promise<{
    data?: StockRecordDocument;
    error?: HttpException;
  }> {
    try {
      const document = await this.StockRecordModel.create(body);
      return { data: document };
    } catch (error) {
      return { error };
    }
  }

  public async updateItem(body): Promise<{
    data?: UpdateResult;
    error?: HttpException;
  }> {
    try {
      const objectId = new Types.ObjectId(body._id);
      const document = await this.StockRecordModel.updateOne(
        { _id: objectId },
        { $set: body },
      );
      return { data: document };
    } catch (error) {
      return { error };
    }
  }

  public async deleteItem(_id: string): Promise<{
    data?: DeleteResult;
    error?: HttpException;
  }> {
    try {
      const objectId = new Types.ObjectId(_id);
      const document = await this.StockRecordModel.deleteOne({ _id: objectId });
      return { data: document };
    } catch (error) {
      return { error };
    }
  }
}

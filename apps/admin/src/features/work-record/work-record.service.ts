import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { WorkRecordDocument } from 'common/models/work-record.model';
import { cloneDeep } from 'lodash';
import {
  CreateWorkRecordDto,
  UpdateWorkRecordDto,
} from './dto/work-record.dto';
import * as dayjs from 'dayjs';
import { MongoQueryModel } from 'nest-mongo-query-parser';

@Injectable()
export class WorkRecordService {
  constructor(
    @InjectModel('WorkRecord', 'mrgreen')
    private readonly WorkRecordModel: Model<WorkRecordDocument>,
  ) {}

  public async getList(query: MongoQueryModel) {
    try {
      const find = this.WorkRecordModel.find(query.filter);
      const count = cloneDeep(find);

      find
        .select(query.select)
        .sort(query.sort)
        .skip(query.skip)
        .limit(query.limit)
        .populate('WorkEventNames');

      const [Items, Count] = await Promise.all([
        find.exec().then((documents) =>
          documents.map((document) => {
            const item = document.toJSON();
            item.RecordDate = dayjs(item.RecordDate).format();
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

  public async getItem(_id: string) {
    try {
      const objectId = new Types.ObjectId(_id);
      const find = this.WorkRecordModel.findById(objectId);
      const data = await find.exec().then((document) => document.toJSON());
      return { data };
    } catch (error) {
      return { error };
    }
  }

  public async createItem(body: CreateWorkRecordDto) {
    try {
      const document = await this.WorkRecordModel.create(body);
      return { data: document };
    } catch (error) {
      return { error };
    }
  }

  public async updateItem(body: UpdateWorkRecordDto) {
    try {
      const objectId = new Types.ObjectId(body._id);
      const document = await this.WorkRecordModel.updateOne(
        { _id: objectId },
        { $set: body },
      );
      return { data: document };
    } catch (error) {
      return { error };
    }
  }

  public async deleteItem(_id: string) {
    try {
      const objectId = new Types.ObjectId(_id);
      const document = await this.WorkRecordModel.deleteOne({ _id: objectId });
      return { data: document };
    } catch (error) {
      return { error };
    }
  }
}

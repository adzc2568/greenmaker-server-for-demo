import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeleteResult } from 'mongodb';
import { IncomeDocument } from 'common/models/income.model';
import { cloneDeep, omit } from 'lodash';
import { Income } from './types/income.type';

@Injectable()
export class IncomeService {
  constructor(
    @InjectModel('Income', 'mrgreen')
    private readonly Model: Model<IncomeDocument>,
  ) {}

  async getList(query): Promise<{
    data?: { Items: Income[]; Count: number };
    error?: Error;
  }> {
    try {
      const find = this.Model.find();
      Object.entries(omit(query, ['skip', 'limit'])).forEach(([key, value]) => {
        find.where(key).equals(value);
      });
      const count = cloneDeep(find);

      find.skip(query.skip);
      find.limit(query.limit);

      const [Items, Count] = await Promise.all([
        find
          .exec()
          .then((documents) =>
            documents.map<Income>((document) => document.toJSON()),
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

  async getItem(_id): Promise<{
    data?: Income;
    error?: Error;
  }> {
    try {
      const find = this.Model.findById(_id);
      const document = await find.exec();
      const data: Income = document.toJSON();
      return { data };
    } catch (error) {
      return { error };
    }
  }

  async createItem(body): Promise<{
    data?: Income;
    error?: Error;
  }> {
    try {
      const document = await this.Model.create(body);
      const data: Income = document.toJSON();
      return { data };
    } catch (error) {
      return { error };
    }
  }

  async updateItem(body): Promise<{
    data?: Income;
    error?: Error;
  }> {
    try {
      const document = await this.Model.findByIdAndUpdate(
        body._id,
        { $set: body },
        { new: true },
      );
      const data: Income = document.toJSON();
      return { data };
    } catch (error) {
      return { error };
    }
  }

  async deleteItem(_id: string): Promise<{
    data?: DeleteResult;
    error?: Error;
  }> {
    try {
      const document = await this.Model.deleteOne({ _id });
      return { data: document };
    } catch (error) {
      return { error };
    }
  }

  async getItemWithOrderId(
    OrderId: string,
    OrderType: string,
  ): Promise<{
    data?: Income;
    error?: Error;
  }> {
    try {
      const find = this.Model.findOne({ OrderId, OrderType });
      const document = await find.exec();
      const data: Income = document.toJSON();
      return { data };
    } catch (error) {
      return { error };
    }
  }

  async insertOrUpdate(body) {
    try {
      const document = await this.Model.findByIdAndUpdate(
        body._id,
        { $set: body },
        { upsert: true, new: true },
      );
      const data = document.toJSON();
      return { data };
    } catch (error) {
      return { error };
    }
  }
}

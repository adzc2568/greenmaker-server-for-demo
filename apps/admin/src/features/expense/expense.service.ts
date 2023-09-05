import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeleteResult } from 'mongodb';
import { ExpenseDocument } from 'common/models/expense.model';
import { cloneDeep } from 'lodash';
import { Expense } from './types/expense.type';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel('Expense', 'mrgreen')
    private readonly Model: Model<ExpenseDocument>,
  ) {}

  async getList(query): Promise<{
    data?: { Items: Expense[]; Count: number };
    error?: Error;
  }> {
    try {
      const find = this.Model.find(query.filter);
      const count = cloneDeep(find);
      find
        .select(query.select)
        .sort(Object.assign(query.sort, { Date: -1 }))
        .skip(query.skip)
        .limit(query.limit);

      const [Items, Count] = await Promise.all([
        find
          .exec()
          .then((documents) =>
            documents.map<Expense>((document) => document.toJSON()),
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
    data?: Expense;
    error?: Error;
  }> {
    try {
      const find = this.Model.findById(_id);
      const document = await find.exec();
      const data: Expense = document.toJSON();
      return { data };
    } catch (error) {
      return { error };
    }
  }

  async createItem(body): Promise<{
    data?: Expense;
    error?: Error;
  }> {
    try {
      const document = await this.Model.create(body);
      const data: Expense = document.toJSON();
      return { data };
    } catch (error) {
      return { error };
    }
  }

  async updateItem(body): Promise<{
    data?: Expense;
    error?: Error;
  }> {
    try {
      const document = await this.Model.findByIdAndUpdate(
        body._id,
        { $set: body },
        { new: true },
      );
      const data: Expense = document.toJSON();
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
    data?: Expense;
    error?: Error;
  }> {
    try {
      const find = this.Model.findOne({ OrderId, OrderType });
      const document = await find.exec();
      const data: Expense = document.toJSON();
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

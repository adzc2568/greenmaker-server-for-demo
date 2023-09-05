import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'common/models/user.model';
import { cloneDeep, omit } from 'lodash';
import { User } from './types/user.type';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User', 'mrgreen')
    private readonly Model: Model<UserDocument>,
  ) {}

  async getList(query): Promise<{
    data?: { Items: User[]; Count: number };
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
            documents.map<User>((document) => document.toJSON()),
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
    data?: User;
    error?: Error;
  }> {
    try {
      const find = this.Model.findById(_id);
      const document = await find.exec();
      const data: User = document.toJSON();
      return { data };
    } catch (error) {
      return { error };
    }
  }

  async createItem(body): Promise<{
    data?: User;
    error?: Error;
  }> {
    try {
      const document = await this.Model.create(body);
      const data: User = document.toJSON();
      return { data };
    } catch (error) {
      return { error };
    }
  }
}

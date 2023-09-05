import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeleteResult } from 'mongodb';
import { MessageDocument } from 'common/models/message.model';
import { cloneDeep, omit } from 'lodash';
import { Message } from './types/message.type';
import { Types } from 'mongoose';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel('Message', 'mrgreen')
    private readonly MessageModel: Model<MessageDocument>,
  ) {}

  async getList(query): Promise<{
    data?: { Items: Message[]; Count: number };
    error?: Error;
  }> {
    try {
      const find = this.MessageModel.find();
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
            documents.map<Message>((document) => document.toJSON()),
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
    data?: Message;
    error?: Error;
  }> {
    try {
      const find = this.MessageModel.findById(_id);
      const document = await find.exec();
      const data: Message = document.toJSON();
      return { data };
    } catch (error) {
      return { error };
    }
  }

  async createItem(body): Promise<{
    data?: Message;
    error?: Error;
  }> {
    try {
      body.IsReaded = false;
      const document = await this.MessageModel.create(body);
      const data: Message = document.toJSON();
      return { data };
    } catch (error) {
      return { error };
    }
  }

  async updateItem(body): Promise<{
    data?: Message;
    error?: Error;
  }> {
    try {
      const document = await this.MessageModel.findByIdAndUpdate(
        body._id,
        { $set: body },
        { new: true },
      );
      const data: Message = document.toJSON();
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
      const document = await this.MessageModel.deleteOne({ _id });
      return { data: document };
    } catch (error) {
      return { error };
    }
  }

  async getLatestAndNotReadedMessage(query): Promise<{
    data?: { Items: Message[]; Count: number };
    error?: Error;
  }> {
    try {
      const aggregate = this.MessageModel.aggregate([{ $match: { IsReaded: true } }]);
      aggregate.group({
        _id: '$ConversationId',
        LatestDate: {
          $last: {
            $mergeObjects: [
              {
                CreateDate: '$CreateDate',
              },
              '$$ROOT',
            ],
          },
        },
      });

      aggregate.replaceRoot('LatestDate');

      const count = cloneDeep(aggregate);

      aggregate.skip(query.skip);
      aggregate.limit(query.limit);

      const [Items, [{ Count }]] = await Promise.all([
        aggregate.exec(),
        count.count('Count').unwind('Count').exec(),
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
}

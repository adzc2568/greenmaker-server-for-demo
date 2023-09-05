import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContactDocument } from 'common/models/contact.model';
import { errorHandler } from 'common/methods/error-handler';
import { cloneDeep, omit } from 'lodash';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel('Contact', 'mrgreen')
    private readonly ContactModel: Model<ContactDocument>,
  ) {}

  public async getList(query) {
    try {
      const find = this.ContactModel.find();
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

  public async getItem(_id) {
    try {
      const find = this.ContactModel.findById(_id);
      const document = await find.exec();
      return { data: document };
    } catch (error) {
      return { error: errorHandler(error) };
    }
  }

  public async createItem(commonData) {
    try {
      const document = await this.ContactModel.create(commonData);
      return { data: document };
    } catch (error) {
      return { error: errorHandler(error) };
    }
  }

  public async updateItem(body) {
    try {
      const document = await this.ContactModel.updateOne(
        { _id: body._id },
        { $set: body },
      );
      return { data: document };
    } catch (error) {
      return { error: errorHandler(error) };
    }
  }

  public async deleteItem(_id: string) {
    try {
      const document = await this.ContactModel.deleteOne({ _id });
      return { data: document };
    } catch (error) {
      return { error: errorHandler(error) };
    }
  }
}

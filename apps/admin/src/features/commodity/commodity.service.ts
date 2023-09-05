import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UpdateResult } from 'mongodb';
import { CommodityDocument } from 'common/models/commodity.model';
import {
  CommodityStatus,
  CommodityStatusItems,
} from 'common/enums/commodity-status';
import { ImageService } from '../image/image.service';
import { Commodity } from './types/commodity.type';
import * as dayjs from 'dayjs';
import { cloneDeep, omit } from 'lodash';

@Injectable()
export class CommodityService {
  constructor(
    @InjectModel('Commodity', 'mrgreen')
    private readonly CommodityModel: Model<CommodityDocument>,

    private readonly ImageService: ImageService,
  ) {}

  public async getList(query): Promise<{
    data?: { Items: Commodity[]; Count: number };
    error?: Error;
  }> {
    try {
      const find = this.CommodityModel.find();
      Object.entries(omit(query, ['skip', 'limit'])).forEach(([key, value]) => {
        find.where(key).equals(value);
      });
      const count = cloneDeep(find);

      find.skip(query.skip);
      find.limit(query.limit);
      find.populate('TypeName');
      find.populate('TagNames');
      find.populate('Images');

      const fields = [
        '_id',
        'Title',
        'TagIds',
        'Summary',
        'CreateDate',
        'UpdateDate',
        'StatusId',
        'TypeId',
      ];
      find.projection(fields);

      const [documents, Count] = await Promise.all([
        find.exec(),
        count.countDocuments(),
      ]);

      const items = documents.map((document) => {
        const item = document.toJSON();
        item.CreateDate = dayjs(item.CreateDate).format();
        item.UpdateDate = dayjs(item.UpdateDate).format();
        item.StatusName = CommodityStatusItems.find(
          ({ Id }) => Id === item.StatusId,
        )?.Name;
        return item as Commodity;
      });

      return {
        data: {
          Items: items,
          Count,
        },
      };
    } catch (error) {
      return { error };
    }
  }

  public async getItem(_id): Promise<{ data?: Commodity; error?: Error }> {
    try {
      const find = this.CommodityModel.findById(_id);
      find.populate('TypeName');
      find.populate('TagNames');
      find.populate('Images');
      const document = await find.exec();
      const item = document.toJSON();
      item.CreateDate = dayjs(item.CreateDate).format();
      item.UpdateDate = dayjs(item.UpdateDate).format();
      item.StatusName = CommodityStatusItems.find(
        ({ Id }) => Id === item.StatusId,
      )?.Name;

      return { data: item as Commodity };
    } catch (error) {
      return { error };
    }
  }

  public async createItem(
    body,
  ): Promise<{ data?: CommodityDocument; error?: Error }> {
    try {
      const _id = new Types.ObjectId();

      body.Status = CommodityStatus.unlaunched;
      body._id = _id;

      const document = await this.CommodityModel.create(body);
      return { data: document };
    } catch (error) {
      return { error };
    }
  }

  public async updateItem(
    body,
  ): Promise<{ data?: UpdateResult; error?: Error }> {
    try {
      if (body.Status) body.Status = undefined;

      const document = await this.CommodityModel.updateOne(
        { _id: body._id },
        { $set: body },
      );
      return { data: document };
    } catch (error) {
      return { error };
    }
  }

  public async deleteItem(_id) {
    try {
      const document = await this.CommodityModel.findByIdAndDelete({ _id });
      const data = document.toJSON();
      data.ImageIds.forEach((_id) => {
        this.ImageService.deleteImage(_id);
      });
      return { data };
    } catch (error) {
      return { error };
    }
  }

  public async statusChange(
    body,
  ): Promise<{ data?: UpdateResult; error?: Error }> {
    try {
      const document = await this.CommodityModel.updateOne(
        { _id: body._id },
        { $set: body },
      );
      return { data: document };
    } catch (error) {
      return { error };
    }
  }
}

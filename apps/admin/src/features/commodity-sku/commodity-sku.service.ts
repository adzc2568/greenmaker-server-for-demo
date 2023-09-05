import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommoditySkuDocument } from 'common/models/commodity-sku.model';
import { Types } from 'mongoose';
import { CommoditySku, StockIncrease } from './types/commodity-sku.type';

@Injectable()
export class CommoditySkuService {
  constructor(
    @InjectModel('CommoditySku', 'mrgreen')
    private readonly CommoditySkuModel: Model<CommoditySkuDocument>,
  ) {}

  public async getList(query) {
    try {
      const find = this.CommoditySkuModel.find();
      Object.entries(query).forEach(([key, value]) => {
        find.where(key).equals(value);
      });
      find.sort({ Index: 1 });
      find.populate('CommodityName');

      const documents = await find.exec();

      const Items = documents.map(
        (document) => document.toJSON() as CommoditySku,
      );

      return { data: Items };
    } catch (error) {
      return { error };
    }
  }

  public async getItem(_id: string): Promise<{
    data?: CommoditySku;
    error?: Error;
  }> {
    try {
      const find = this.CommoditySkuModel.findById(_id);
      find.populate('CommodityName');
      const document = await find.exec();
      const data: CommoditySku = document.toJSON();
      return { data };
    } catch (error) {
      return { error };
    }
  }

  public async insertOrUpdate(body: Partial<CommoditySku>): Promise<{
    data?: CommoditySku;
    error?: Error;
  }> {
    try {
      const document = await this.CommoditySkuModel.findByIdAndUpdate(
        body._id,
        { $set: body },
        { upsert: true, returnDocument: 'after' },
      )
        .populate('CommodityName')
        .exec();

      const data: CommoditySku = document.toJSON();

      return { data };
    } catch (error) {
      return { error };
    }
  }

  public async deleteItem(_id: string) {
    try {
      const document = await this.CommoditySkuModel.deleteOne({ _id });
      return { data: document };
    } catch (error) {
      return { error };
    }
  }

  public async stockIncrease(body: StockIncrease): Promise<{
    data?: CommoditySku;
    error?: Error;
  }> {
    try {
      const find = this.CommoditySkuModel.findById(body._id);
      find.populate('CommodityName');
      const document = await find.exec();
      const data: CommoditySku = document.toJSON();

      if (data.Stock + body.Increase < 0) {
        throw new Error('減少之庫存不得少與當前庫存');
      }

      await this.CommoditySkuModel.updateOne(
        { _id: body._id },
        { $inc: { Stock: body.Increase } },
      );

      data.Stock = data.Stock + body.Increase;

      return { data };
    } catch (error) {
      return { error };
    }
  }
}

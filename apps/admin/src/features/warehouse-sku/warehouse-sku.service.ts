import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeleteResult } from 'mongodb';
import { WarehouseSkuDocument } from 'common/models/warehouse-sku.model';
import { WarehouseSku, StockIncrease } from './types/warehouse-sku.type';
import { MongoQueryParser } from 'nest-mongo-query-parser';

@Injectable()
export class WarehouseSkuService {
  constructor(
    @InjectModel('WarehouseSku', 'mrgreen')
    private readonly WarehouseSkuModel: Model<WarehouseSkuDocument>,
  ) {}

  @MongoQueryParser()
  public async getList(query) {
    try {
      const find = this.WarehouseSkuModel.find(query.filter);
      find.sort({ Index: -1 }).populate('WarehouseName');

      const documents = await find.exec();

      const Items = documents.map(
        (document) => document.toJSON() as WarehouseSku,
      );

      return { data: Items };
    } catch (error) {
      return { error };
    }
  }

  public async getItem(_id: string): Promise<{
    data?: WarehouseSku;
    error?: Error;
  }> {
    try {
      const find = this.WarehouseSkuModel.findById(_id);
      find.populate('WarehouseName');
      const document = await find.exec();
      const data: WarehouseSku = document.toJSON();
      return { data };
    } catch (error) {
      return { error };
    }
  }

  async createItem(body): Promise<{
    data?: WarehouseSku;
    error?: Error;
  }> {
    try {
      const document = await this.WarehouseSkuModel.create(body);
      await document.populate(['WarehouseName']);
      document.populated('WarehouseName');
      const data: WarehouseSku = document.toJSON();
      return { data };
    } catch (error) {
      return { error };
    }
  }

  async updateItem(body): Promise<{
    data?: WarehouseSku;
    error?: Error;
  }> {
    try {
      const document = await this.WarehouseSkuModel.findByIdAndUpdate(
        body._id,
        { $set: body },
        { new: true },
      )
        .populate('WarehouseName')
        .exec();
      const data: WarehouseSku = document.toJSON();
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
      const document = await this.WarehouseSkuModel.deleteOne({ _id });
      return { data: document };
    } catch (error) {
      return { error };
    }
  }

  public async stockIncrease(body: StockIncrease): Promise<{
    data?: WarehouseSku;
    error?: Error;
  }> {
    try {
      const find = this.WarehouseSkuModel.findById(body._id);
      find.populate('WarehouseName');
      const document = await find.exec();
      const data: WarehouseSku = document?.toJSON();

      if (!data) return { data };

      if (data.Stock + body.Increase < 0) {
        throw new Error('減少之庫存不得少與當前庫存');
      }

      await this.WarehouseSkuModel.updateOne(
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

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeleteResult } from 'mongodb';
import { WarehouseDocument } from 'common/models/warehouse.model';
import { cloneDeep, omit, difference } from 'lodash';
import {
  WarehouseQueryDto,
  CreateWarehouseDto,
  UpdateWarehouseDto,
  StockMoveDto,
  StockUpdateDto,
  StockUpdateSkuDto,
} from './dto/warehouse.dto';
import { Warehouse } from './types/warehouse.type';
import { WarehouseSkuService } from '../warehouse-sku/warehouse-sku.service';
import { StockRecordService } from '../stock-record/stock-record.service';
import * as dayjs from 'dayjs';
import { WarehouseSku } from '../warehouse-sku/types/warehouse-sku.type';
import { Types } from 'mongoose';
import { MongoQueryModel } from 'nest-mongo-query-parser';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectModel('Warehouse', 'mrgreen')
    private readonly WarehouseModel: Model<WarehouseDocument>,

    private readonly StockRecordService: StockRecordService,

    private readonly WarehouseSkuService: WarehouseSkuService,
  ) {}

  public async getList(query: MongoQueryModel): Promise<{
    data?: { Items: Warehouse[]; Count: number };
    error?: Error;
  }> {
    try {
      const find = this.WarehouseModel.find(query.filter);
      const count = cloneDeep(find);

      find
        .select(query.select)
        .sort(query.sort)
        .skip(query.skip)
        .limit(query.limit)
        .populate('TypeName')
        .populate('Skus');

      const [Items, Count] = await Promise.all([
        find
          .exec()
          .then((documents) =>
            documents.map<Warehouse>((document) => document.toJSON()),
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

  public async getItem(_id: string): Promise<{
    data?: Warehouse;
    error?: Error;
  }> {
    try {
      const find = this.WarehouseModel.findById(_id);
      find.populate('Skus');
      const document = await find.exec();
      const data: Warehouse = document.toJSON();
      return { data };
    } catch (error) {
      return { error };
    }
  }

  public async createItem(body: CreateWarehouseDto): Promise<{
    data?: Warehouse;
    error?: Error;
  }> {
    try {
      const cloneSkus = cloneDeep(body.Skus);
      const document = await this.WarehouseModel.create(body);

      const tasks = cloneSkus.map((sku, index) => {
        const insertSku = { ...sku, WarehouseId: document._id, Index: index };
        return this.WarehouseSkuService.createItem(insertSku);
      });

      await Promise.all(tasks);

      await document.populate(['Skus']);
      document.populated('Skus');

      const data: Warehouse = document.toJSON();

      return { data };
    } catch (error) {
      return { error };
    }
  }

  public async updateItem(body: UpdateWarehouseDto): Promise<{
    data?: Warehouse;
    error?: Error;
  }> {
    try {
      const find = this.WarehouseModel.findById(body._id);
      find.populate('Skus');
      const originDocument = await find.exec();
      const originData = originDocument.toJSON();

      const cloneSkus = cloneDeep(body.Skus);
      const document = await this.WarehouseModel.findByIdAndUpdate(
        body._id,
        { $set: body },
        { new: true },
      );

      const wantToDeleteSkus = difference<string>(
        originData.Skus.map(({ _id }) => new Types.ObjectId(_id).toString()),
        cloneSkus.map(({ _id }) => _id),
      );

      const tasks = cloneSkus
        .map((sku, index) => {
          // 舊的 Sku 僅能變更 WarehouseId, Index
          const insertSku = {
            _id: sku._id,
            WarehouseId: body._id,
            Index: index,
          };
          if (!sku._id) Object.assign(insertSku, sku);
          return insertSku;
        })
        .map((sku) =>
          sku._id
            ? this.WarehouseSkuService.updateItem(sku)
            : this.WarehouseSkuService.createItem(sku),
        )
        .concat(
          wantToDeleteSkus.map<Promise<any>>((_id) =>
            this.WarehouseSkuService.deleteItem(_id),
          ),
        );

      await Promise.all(tasks);

      await document.populate(['Skus']);
      document.populated('Skus');

      const data: Warehouse = document.toJSON();

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
      const skusRes = await this.WarehouseSkuService.getList({
        WarehouseId: `eq:${_id}`,
      });

      let { error } = skusRes;
      if (error) throw error;

      const deleteSkuTasks = skusRes.data.map((sku) => {
        return this.WarehouseSkuService.deleteItem(sku._id);
      });

      const deleteSkuRes = await Promise.all(deleteSkuTasks);
      error = deleteSkuRes.find(({ error }) => error)?.error;
      if (error) throw error;

      const document = await this.WarehouseModel.deleteOne({ _id });

      return { data: document };
    } catch (error) {
      return { error };
    }
  }

  public async stockMove(body: StockMoveDto): Promise<{
    data?: WarehouseSku[];
    error?: Error;
  }> {
    try {
      const tasks = body.StockMoveItems.map((item) => {
        return new Promise<WarehouseSku[]>(async (resolve) => {
          const findRes = await Promise.all([
            this.WarehouseSkuService.getItem(item.FromSkuId),
            this.WarehouseSkuService.getItem(item.ToSkuId),
          ]);

          let error = findRes.find(({ error }) => error)?.error;
          if (error) throw error;

          const [originFromSku, originToSku] = findRes.map(({ data }) => data);
          const updateTasks = [];
          const fromBody = cloneDeep(originFromSku);
          fromBody.Stock -= item.Amount;
          const ToBody = cloneDeep(originToSku);
          ToBody.Stock += item.Amount;
          if (fromBody.Stock < 0) {
            throw new Error(`${item.FromSkuId}，庫存變更結果不得小於零`);
          } else {
            updateTasks.push(
              this.WarehouseSkuService.updateItem(fromBody),
              this.WarehouseSkuService.updateItem(ToBody),
            );
          }

          const updateRes = await Promise.all(updateTasks);
          resolve(updateRes);

          (async () => {
            updateRes.forEach(({ data }, index) => {
              const originSku = findRes[index].data;

              const stockRecordData = {
                Type: '倉儲庫存轉移',
                RecordDate: dayjs().format(),
                Detail: {
                  WarehouseId: data.WarehouseId,
                  WarehouseName: data.WarehouseName,
                  WarehouseSkuId: data._id,
                  WarehouseSkuName: data.SkuOptions.map(
                    ({ OptionName, OptionValue }) =>
                      `${OptionName}: ${OptionValue}`,
                  ).join(', '),
                  OriginStock: originSku.Stock,
                  IncreaseStock: data.Stock - originSku.Stock,
                  ResultStock: data.Stock,
                },
                Remark: `從 ${updateRes[0].data.WarehouseName} 轉移至 ${updateRes[1].data.WarehouseName}`,
              };

              this.StockRecordService.createItem(stockRecordData);
            });
          })();
        });
      });

      const stockMoveRes = await Promise.all(tasks);

      return { data: stockMoveRes.flat() };
    } catch (error) {
      return { error };
    }
  }
  // MongoQuery, MongoQueryModel
  public async stockUpdate(body: StockUpdateDto): Promise<{
    data?: WarehouseSku[];
    error?: Error;
  }> {
    try {
      const skusRes = await this.WarehouseSkuService.getList({
        WarehouseId: `eq:${body._id}`,
      });
      let { error } = skusRes;
      if (error) throw error;

      const needUpdateSkus = body.Skus.reduce((arr, sku) => {
        const originSku = skusRes.data.find(
          (originSku) => originSku._id.toString() === sku._id.toString(),
        );

        if (originSku && sku.Stock !== originSku.Stock) {
          const updateSku: StockUpdateSkuDto = Object.assign(
            cloneDeep(originSku),
            { Stock: sku.Stock, Remark: sku.Remark },
          );
          arr.push(updateSku);
        }

        return arr;
      }, []);

      const updateSkuTasks = needUpdateSkus.map((sku) => {
        return this.WarehouseSkuService.updateItem(sku);
      });

      const updateRes = await Promise.all(updateSkuTasks);
      error = updateRes.find(({ error }) => error)?.error;
      if (error) throw error;

      (async () => {
        updateRes.forEach(({ data }, index) => {
          const originSku = skusRes.data.find(
            (originSku) => originSku._id.toString() === data._id.toString(),
          );

          const stockRecordData = {
            Type: '倉儲庫存變更',
            RecordDate: dayjs().format(),
            Detail: {
              WarehouseId: data.WarehouseId,
              WarehouseName: data.WarehouseName,
              WarehouseSkuId: data._id,
              WarehouseSkuName: data.SkuOptions.map(
                ({ OptionName, OptionValue }) =>
                  `${OptionName}: ${OptionValue}`,
              ).join(', '),
              OriginStock: originSku.Stock,
              IncreaseStock: data.Stock - originSku.Stock,
              ResultStock: data.Stock,
            },
            Remark: needUpdateSkus[index].Remark,
          };

          this.StockRecordService.createItem(stockRecordData);
        });
      })();

      const data = updateRes.map(({ data }) => data);

      return { data };
    } catch (error) {
      return { error };
    }
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PurchaseOrderDocument } from 'common/models/purchase-order.model';
import { cloneDeep, omit, groupBy, sum } from 'lodash';
import { WarehouseSkuService } from '../warehouse-sku/warehouse-sku.service';
import { ExpenseService } from '../expense/expense.service';
import { PurchaseOrder } from './types/purchase-order.type';
import {
  PurchaseOrderDto,
  PurchaseOrderWithIdDto,
} from './dto/purchase-order.dto';
import { StockRecordService } from '../stock-record/stock-record.service';

import * as dayjs from 'dayjs';
import { Types } from 'mongoose';

@Injectable()
export class PurchaseOrderService {
  constructor(
    @InjectModel('PurchaseOrder', 'mrgreen')
    private readonly PurchaseOrderModel: Model<PurchaseOrderDocument>,

    private readonly WarehouseSkuService: WarehouseSkuService,

    private readonly ExpenseService: ExpenseService,

    private readonly StockRecordService: StockRecordService,
  ) {}

  public async getList(query) {
    try {
      const find = this.PurchaseOrderModel.find();
      Object.entries(omit(query, ['skip', 'limit'])).forEach(([key, value]) => {
        find.where(key).equals(value);
      });
      const count = cloneDeep(find);

      find.skip(query.skip);
      find.limit(query.limit);
      find.sort({ PurchaseDate: -1 });

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
      return { error };
    }
  }

  public async getItem(_id: string) {
    try {
      const objectId = new Types.ObjectId(_id);
      const find = this.PurchaseOrderModel.findById(objectId);
      const document = await find.exec();
      const data = document.toJSON() as PurchaseOrder;
      return { data };
    } catch (error) {
      return { error };
    }
  }

  public async createItem(body: PurchaseOrderDto) {
    try {
      const document = await this.PurchaseOrderModel.create(body);

      const stockIncreaseItems = this.getStockIncreaseItems(body.Details);

      const increaseTasks = stockIncreaseItems.map((increaseData) =>
        this.WarehouseSkuService.stockIncrease(increaseData),
      );

      const increaseRes = await Promise.all(increaseTasks);

      const error = increaseRes.find(({ error }) => error)?.error;
      if (error) throw error;

      (() => {
        this.ExpenseService.createItem({
          Date: body.PurchaseDate,
          ItemName: `進貨單 - ${dayjs(body.PurchaseDate).format('YYYY-MM-DD')}`,
          Cost: body.TotalPrice,
          Remark: body.Remark,
          OrderId: document._id,
        });

        increaseRes.forEach(async ({ data, error }, index) => {
          if (error) return;

          this.StockRecordService.createItem({
            Type: '建立進貨單',
            RecordDate: dayjs().format(),
            Detail: {
              WarehouseId: new Types.ObjectId(data.WarehouseId),
              WarehouseName: data.WarehouseName,
              WarehouseSkuId: new Types.ObjectId(data._id),
              WarehouseSkuName: data.SkuOptions.map(
                ({ OptionName, OptionValue }) =>
                  `${OptionName}: ${OptionValue}`,
              ).join(', '),
              OriginStock: data.Stock - stockIncreaseItems[index].Increase,
              IncreaseStock: stockIncreaseItems[index].Increase,
              ResultStock: data.Stock,
            },
            Remark: `建立進貨單 - ${document._id.toString()}`,
          });
        });
      })();

      const data = { ...body, _id: document._id };

      return { data };
    } catch (error) {
      return { error };
    }
  }

  public async updateItem(body: PurchaseOrderWithIdDto) {
    try {
      const res = await this.getItem(body._id);
      const originItem = res.data;
      let error = res.error;
      if (error) throw error;

      const originIncreaseStockItems = this.getStockIncreaseItems(
        originItem.Details,
      ).map((item) => ({ ...item, isOrigin: true }));

      const currentIncreaseStockItems = this.getStockIncreaseItems(
        body.Details,
      );

      const resultIncreaseStockItems = [];
      for (let i = 0; i < originIncreaseStockItems.length; i++) {
        const originItem = originIncreaseStockItems[i];
        let isCurrentExist = false;
        for (let j = 0; j < currentIncreaseStockItems.length; j++) {
          const currentItem = currentIncreaseStockItems.splice(j, 1)[0];
          if (currentItem._id === originItem._id) {
            currentItem.Increase = currentItem.Increase - originItem.Increase;
            resultIncreaseStockItems.push(currentItem);
            j = 0;
            isCurrentExist = true;
            break;
          }
        }
        if (!isCurrentExist) {
          const result = cloneDeep(originItem);
          result.Increase = -result.Increase;
          resultIncreaseStockItems.push(result);
        }
      }

      const updateTasks = resultIncreaseStockItems.map((increaseData) =>
        this.WarehouseSkuService.stockIncrease(increaseData),
      );

      const increaseRes = await Promise.all(updateTasks);
      error = increaseRes.find(({ error }) => error)?.error;

      if (error) throw error;

      const document = await this.PurchaseOrderModel.updateOne(
        { _id: body._id },
        { $set: body },
      );

      (async () => {
        increaseRes
          .filter(({ data }) => data)
          .forEach(({ data }, index) => {
            this.StockRecordService.createItem({
              Type: '變更進貨單',
              RecordDate: dayjs().format(),
              Detail: {
                WarehouseId: data.WarehouseId,
                WarehouseName: data.WarehouseName,
                WarehouseSkuId: data._id,
                WarehouseSkuName: data.SkuOptions.map(
                  ({ OptionName, OptionValue }) =>
                    `${OptionName}: ${OptionValue}`,
                ).join(', '),
                OriginStock:
                  data.Stock - resultIncreaseStockItems[index].Increase,
                IncreaseStock: resultIncreaseStockItems[index].Increase,
                ResultStock: data.Stock,
              },
              Remark: `變更進貨單 - ${body._id}`,
            });
          });

        this.ExpenseService.insertOrUpdate({
          Date: body.PurchaseDate,
          ItemName: `進貨單 - ${dayjs(body.PurchaseDate).format('YYYY-MM-DD')}`,
          Cost: body.TotalPrice,
          Remark: body.Remark,
          OrderId: body._id,
        });
      })();

      return { data: body };
    } catch (error) {
      console.log(error);
      return { error };
    }
  }

  public async deleteItem(_id: string) {
    try {
      const objectId = new Types.ObjectId(_id);
      const document = await this.PurchaseOrderModel.deleteOne({
        _id: objectId,
      });
      return { data: document };
    } catch (error) {
      return { error };
    }
  }

  private getStockIncreaseItems = (details) => {
    // 將同商品同規格的 Detail 合併為一項
    const detailsGroupBySkuId = groupBy(details, 'SkuId');
    const stockIncreaseItems = Object.entries(detailsGroupBySkuId).map(
      ([key, value]) => {
        const allStock = sum(value.map(({ Amount }) => Amount));

        return {
          _id: key,
          Increase: allStock,
        };
      },
    );

    return stockIncreaseItems;
  };
}

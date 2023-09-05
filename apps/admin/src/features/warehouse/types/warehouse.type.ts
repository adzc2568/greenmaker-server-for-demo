import { WarehouseSku } from '../../warehouse-sku/types/warehouse-sku.type';

type Option = {
  Name: string;
  Items: string[];
};

export type Warehouse = {
  _id: string;
  TypeId: string;
  Name: string;
  Skus: WarehouseSku[];
  Options: Option[];
};

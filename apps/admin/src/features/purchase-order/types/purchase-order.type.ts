import { SkuOption } from '../../warehouse-sku/types/warehouse-sku.type';

export type Detail = {
  WarehouseId: string;
  WarehouseName: string;
  SkuOptions: SkuOption[];
  SkuName: string;
  ContactId: string;
  ContactName: string;
  Price: number;
  Amount: number;
  Remark: string;
};

export type PurchaseOrder = {
  _id: string;
  PurchaseDate: Date;
  Details: Detail[];
  TotalPrice: number;
  Remark: string;
};

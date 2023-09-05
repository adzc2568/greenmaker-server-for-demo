export type SkuOption = {
  OptionName: string;
  OptionValue: string;
};

export type WarehouseSku = {
  _id: string;
  WarehouseId: string;
  WarehouseName: string;
  SkuOptions: SkuOption[];
  Stock: number;
  Index: number;
};

export type StockIncrease = {
  _id: string;
  Increase: number;
};

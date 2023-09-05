export type SkuOption = {
  OptionName: string;
  OptionValue: string;
};

export type CommoditySku = {
  _id: string;
  CommodityId: string;
  CommodityName: string;
  SkuOptions: SkuOption[];
  Stock: number;
  Index: number;
};

export type StockIncrease = {
  _id: string;
  Increase: number;
};

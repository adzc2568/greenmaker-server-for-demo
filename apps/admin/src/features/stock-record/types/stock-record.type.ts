type Detail = {
  OriginData: object;
  ResultData: object;
};

export type StockRecord = {
  Type: string;
  RecordDate: Date;
  Detail: Detail;
};

export enum CommodityStatus {
  unlaunched = 0,
  launched = 10,
}

export const CommodityStatusItems = [
  { Id: CommodityStatus.unlaunched, Name: '未上架' },
  { Id: CommodityStatus.launched, Name: '已上架' },
];

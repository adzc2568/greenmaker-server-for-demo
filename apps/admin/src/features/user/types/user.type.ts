interface Cart {
  WarehouseId: string;
  WarehouseSkuId: string;
  Amount: number;
}

interface BuyerInfo {
  DeliveryType: string;
  ReceiverName: string;
  Address: string;
}

export interface User {
  Account: string;
  Uid: string;
  BuyerInfo: BuyerInfo[];
  ConversationId: string;
  Cart: Cart[];
}

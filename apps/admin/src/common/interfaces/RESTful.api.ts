import { HttpException } from '@nestjs/common';
import {
  Query,
  ListData,
  ListReturnData,
  ItemReturnData,
} from '../types/api.type';

export interface RESTfulApiController {
  getList(query: Query): Promise<ListData | HttpException>;

  getItem(_id: string): Promise<any | HttpException>;

  postItem(body: any): Promise<any | HttpException>;

  putItem(body: any): Promise<any | HttpException>;

  deleteItem(_id: string): Promise<any | HttpException>;
}

export interface RESTfulApiService {
  getList(query: Query): Promise<ListReturnData>;

  getItem(_id: string): Promise<ItemReturnData>;

  postItem(body: any): Promise<ItemReturnData>;

  putItem(body: any): Promise<ItemReturnData>;

  deleteItem(_id: string): Promise<ItemReturnData>;
}

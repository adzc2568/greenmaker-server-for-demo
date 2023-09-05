import { HttpException } from '@nestjs/common';

export type Query = {
  [key: string]: any;
};

export type ListData = {
  Items: any[];
  Count: number;
};

export type ItemReturnData = {
  data?: any;
  error?: HttpException;
};

export type ListReturnData = {
  data?: ListData;
  error?: HttpException;
};

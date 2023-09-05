import { Types } from 'mongoose';
import { Image } from '../../image/types/image.type';

export type Contents = {
  id?: string;
  type: string;
  attributes?: object;
  textContent?: string;
};

export type Article = {
  UrlTitle: string;
  Title: string;
  Contents: Contents[];
  Summary: string;
  HTML: string;
  TagIds: string[];
  TagNames: string[];
  TypeId: string;
  TypeName: string;
  ImageIds: (string | Types.ObjectId)[];
  Images: Image[];
};

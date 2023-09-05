import { ArticleStatus } from 'common/enums/article-status';
import { Image } from '../../image/types/image.type';

export interface Contents {
  id?: string;
  type: string;
  attributes?: object;
  textContent?: string;
}

export interface Article {
  UrlTitle: string;
  Title: string;
  TagIds: string[];
  TypeId: string;
  Contents: Contents[];
  Summary: string;
  HTML: string;
  ImageIds: string[];
  Images: Image[];
  StatusId: ArticleStatus;
  StatusName: string;
  CreateDate: string;
  UpdateDate: string;
}

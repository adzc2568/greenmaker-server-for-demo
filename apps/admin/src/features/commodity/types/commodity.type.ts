import { Image } from '../../image/types/image.type';

type Content = {
  id?: string;
  type: string;
  attributes?: object;
  textContent?: string;
  childNodes?: Content[];
};

export type Commodity = {
  UrlTitle: string;

  Title: string;

  TagIds: string[];
  TagNames: string[];

  TypeId: string;
  TypeName: string;

  Contents: Content[];

  Summary: string;

  HTML: string;

  ImageIds: string[];
  Images: Image[];

  StatusId: number;
  StatusName: string;

  CreateDate: string;
  UpdateDate: string;
};

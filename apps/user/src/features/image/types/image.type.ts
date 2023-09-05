export type Image = {
  _id: string;
  FullPath: string;
  BasePath: string;
  Type: string;
  Width: number;
  Height: number;
  Name: string;
  Description: string;
};

export type TempImage = {
  _id: string;
  FullPath: string;
  Type: string;
  Width: number;
  Height: number;
  Name: string;
  Description: string;
  Temp: boolean;
  Buffer?: Buffer;
  ExtName?: string;
};

export type UploadImage = Image & TempImage & { Parent_id: string };

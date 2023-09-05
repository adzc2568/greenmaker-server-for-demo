interface ImageData {
  BasePath: string;
  Width: number;
  Height: number;
}

export interface Image {
  _id: string;
  Type: string;
  Name: string;
  Description: string;
  Temp?: boolean;
  Origin: ImageData;
  Thumb?: ImageData;
}

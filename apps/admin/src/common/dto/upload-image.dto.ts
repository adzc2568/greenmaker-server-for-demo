import { IsString, IsArray, IsObject } from 'class-validator';
import { Transform } from 'class-transformer';
import { FileTypeValidator } from '@nestjs/common';

class ImageData {
  @IsString()
  public readonly Name: string;

  @IsString()
  public readonly Description: string;
}

export class UploadImageDto {
  @IsString()
  public readonly _id: string;

  @IsArray()
  @IsObject({ each: true })
  @Transform(({ value }) => {
    return value.map((item) =>
      typeof item === 'string' ? JSON.parse(item) : item,
    );
  })
  public readonly ImageData: ImageData[];
}

export const fileValidators = [
  new FileTypeValidator({ fileType: /^image\/jpeg|png$/ }),
];

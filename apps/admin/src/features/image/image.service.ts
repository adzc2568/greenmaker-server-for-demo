import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ImageDocument } from 'common/models/image.model';
import { Image } from './types/image.type';
import { FirebaseService } from '../firebase/firebase.service';
import { mkdir, readdir, writeFile, unlink, rmdir, Dirent } from 'node:fs';
import sizeOf from 'image-size';
import * as path from 'path';
import { Cron } from '@nestjs/schedule';
import * as sharp from 'sharp';

@Injectable()
export class ImageService {
  private cropTasks = {};

  constructor(
    @InjectModel('Image', 'mrgreen')
    private readonly ImageModel: Model<ImageDocument>,

    private readonly FirebaseService: FirebaseService,
  ) {}

  public async getList(query: { Type: string; ParentId?: string }): Promise<{
    data?: Image[];
    error?: Error;
  }> {
    try {
      const documents = await this.ImageModel.find({
        Type: query.Type,
        'Origin.BasePath': { $regex: query.ParentId },
      });

      const data: Image[] = documents.map((document) => document.toJSON());

      return { data };
    } catch (error) {
      return { error };
    }
  }

  private async mkdir(path) {
    return new Promise<{ error?: NodeJS.ErrnoException }>((resolve) => {
      mkdir(path, (error) => {
        if (error && error.code !== 'EEXIST') resolve({ error });
        else resolve({});
      });
    });
  }

  private async unlink(path) {
    return new Promise((resolve) => {
      unlink(path, (error) => {
        resolve({ error });
      });
    });
  }

  private async rmdir(path) {
    return new Promise((resolve) => {
      rmdir(path, (error) => {
        resolve({ error });
      });
    });
  }

  private async readdir(
    path,
  ): Promise<{ data?: Dirent[]; error?: NodeJS.ErrnoException }> {
    return new Promise((resolve) => {
      readdir(path, { withFileTypes: true }, (error, dirents) => {
        resolve({ data: dirents, error });
      });
    });
  }

  private async writeFile(
    path,
    file,
  ): Promise<{ error?: NodeJS.ErrnoException }> {
    return new Promise((resolve) => {
      writeFile(path + `/${file.originalname}`, file.buffer, (error) => {
        resolve({ error });
      });
    });
  }

  public async deleteImage(_id: string) {
    try {
      const objectId = new Types.ObjectId(_id);
      const document = await this.ImageModel.findByIdAndDelete({
        _id: objectId,
      });
      const data = document.toJSON();

      this.FirebaseService.deleteOne(data.Origin.BasePath);
      this.FirebaseService.deleteOne(data.Thumb.BasePath);

      return { data };
    } catch (error) {
      return { error };
    }
  }

  public async uploadTempImage(
    file: {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      buffer: Buffer;
      size: number;
    },
    body: {
      Type: string;
      ParentId?: string;
    },
  ): Promise<{
    data?: Image;
    error?: Error;
  }> {
    try {
      const folderPath = `${body.Type}/${body.ParentId || 'no_id'}`;
      const uploadPath = process.cwd() + `/upload/${folderPath}`;
      const { error: mkdirError } = await this.mkdir(uploadPath);
      if (mkdirError) throw mkdirError;

      const _id = new Types.ObjectId().toString();
      const parse = path.parse(file.originalname);

      const fileName = _id + parse.ext;
      file.originalname = fileName;
      const { error: writeFileError } = await this.writeFile(uploadPath, file);
      if (writeFileError) throw writeFileError;

      const { width: Width, height: Height } = sizeOf(file.buffer);
      const Path = `${folderPath}/${fileName}`;

      const data: Image = {
        _id,
        Type: body.Type,
        Origin: { BasePath: Path, Width, Height },
        Name: null,
        Description: null,
        Temp: true,
      };

      return { data };
    } catch (error) {
      return { error };
    }
  }

  public async uploadTempImageToFirebase(
    image: Image & { ParentId: string },
  ): Promise<{
    data?: Image;
    error?: Error;
  }> {
    try {
      const { data: cropData, error } = await Promise.resolve(
        this.cropTasks[image._id],
      );
      this.cropTasks[image._id] = undefined;

      if (error) throw error;

      const filePaths = [
        `/upload/${cropData.Origin.BasePath}`,
        `/upload/${cropData.Thumb.BasePath}`,
      ];

      const tasks = filePaths.map(async (filePath) => {
        const imageSharp = sharp(process.cwd() + filePath);
        const imageBuffer = await imageSharp.toBuffer();
        const imageMetadata = await imageSharp.metadata();

        const fileName = path.parse(filePath).base;
        const { data: firebaseData } = await this.FirebaseService.uploadOne(
          `${image.Type}/${image.ParentId}/${fileName}`,
          imageBuffer,
        );

        return { imageMetadata, imageBuffer, firebaseData };
      });

      const res = await Promise.all(tasks);

      const originMetadata = res[0].imageMetadata;
      const origin = {
        BasePath: res[0].firebaseData.BasePath,
        Width: originMetadata.width,
        Height: originMetadata.height,
      };

      const thumbMetadata = res[1].imageMetadata;
      const thumb = {
        BasePath: res[1].firebaseData.BasePath,
        Width: thumbMetadata.width,
        Height: thumbMetadata.height,
      };

      image.Origin = origin;
      image.Thumb = thumb;

      const document = await this.ImageModel.create(image);

      const data: Image = document.toJSON();

      return { data };
    } catch (error) {
      return { error };
    }
  }

  @Cron('0 0 0 * * *')
  async deleteTemp(targetPath?) {
    try {
      const readAndDelete = async (targetPath) => {
        const { data } = await this.readdir(targetPath);

        for (let i = 0; i < data.length; i++) {
          const dir = data[i];
          if (dir.isFile()) await this.unlink(targetPath + `/${dir.name}`);
          else await readAndDelete(targetPath + `/${dir.name}`);
          this.rmdir(targetPath + `/${dir.name}`);
        }
      };

      const basePaths = targetPath
        ? Array.isArray(targetPath)
          ? targetPath
          : [targetPath]
        : ['/upload/Plant', '/upload/Article', '/upload/Commodity'];

      basePaths.forEach((basePath) => {
        readAndDelete(process.cwd() + basePath);
      });

      return {};
    } catch (error) {
      return { error };
    }
  }

  public addCropTask(body) {
    const task = this.cropTempImage(body);
    this.cropTasks[body._id] = task;
  }

  public async cropTempImage(body): Promise<{
    data?: Image;
    error?: Error;
  }> {
    try {
      const filePath = process.cwd() + `/upload/${body.Origin.BasePath}`;

      const imageSharp = sharp(filePath);
      const afterExtract = await imageSharp.metadata().then((metadata) => {
        if (!metadata.orientation) {
          return imageSharp.extract({
            left: body.Left,
            top: body.Top,
            width: body.Width,
            height: body.Height,
          });
        }

        const orientationHandler = {
          1: (sharpInstance) => sharpInstance,
          2: (sharpInstance) => sharpInstance.flop(),
          3: (sharpInstance) => sharpInstance.rotate(180),
          4: (sharpInstance) => sharpInstance.flip(),
          5: (sharpInstance) => sharpInstance.rotate(90).flop(),
          6: (sharpInstance) => sharpInstance.rotate(90),
          7: (sharpInstance) => sharpInstance.rotate(90).flip(),
          8: (sharpInstance) => sharpInstance.rotate(-90),
        };

        return orientationHandler[metadata.orientation](imageSharp).extract({
          left: body.Left,
          top: body.Top,
          width: body.Width,
          height: body.Height,
        });
      });

      const parse = path.parse(body.Origin.BasePath);
      const originBasePath = body.Origin.BasePath.replace(
        parse.base,
        `${parse.name}.avif`,
      );
      const thumbBasePath = body.Origin.BasePath.replace(
        parse.base,
        `${parse.name}_thumbnail.avif`,
      );
      const outPath = process.cwd() + `/upload/${originBasePath}`;
      const thumbOutPath = process.cwd() + `/upload/${thumbBasePath}`;

      const size = {
        Plant: [
          [768, 768],
          [256, 256],
        ],
        Article: [
          [1920, 1080],
          [640, 360],
        ],
      };
      const res = await Promise.all([
        afterExtract.resize(...size[body.Type][0]).toFile(outPath),
        afterExtract.resize(...size[body.Type][1]).toFile(thumbOutPath),
      ]);

      const data: Image = {
        _id: parse.name,
        Type: body.Type,
        Origin: {
          BasePath: originBasePath,
          Width: res[0].width,
          Height: res[0].height,
        },
        Thumb: {
          BasePath: thumbBasePath,
          Width: res[1].width,
          Height: res[1].height,
        },
        Name: null,
        Description: null,
        Temp: true,
      };
      return { data };
    } catch (error) {
      return { error };
    }
  }
}

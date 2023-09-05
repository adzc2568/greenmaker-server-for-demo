import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PlantDocument } from 'common/models/plant.model';
import { cloneDeep, omit, difference } from 'lodash';
import { ImageService } from '../image/image.service';

@Injectable()
export class PlantService {
  constructor(
    @InjectModel('Plant', 'mrgreen')
    private readonly PlantModel: Model<PlantDocument>,

    private readonly ImageService: ImageService,
  ) {}

  public async getList(query) {
    try {
      const find = this.PlantModel.find();
      Object.entries(omit(query, ['skip', 'limit'])).forEach(([key, value]) => {
        find.where(key).equals(value);
      });
      const count = cloneDeep(find);

      find.skip(query.skip);
      find.limit(query.limit);
      find.populate('Images');

      const [Items, Count] = await Promise.all([
        find
          .exec()
          .then((documents) => documents.map((document) => document.toJSON())),
        count.countDocuments(),
      ]);

      return {
        data: {
          Items,
          Count,
        },
      };
    } catch (error) {
      return { error };
    }
  }

  public async getItem(_id: string) {
    try {
      const find = this.PlantModel.findById(_id);
      find.populate('Images');
      const data = (await find.exec()).toJSON();
      return { data };
    } catch (error) {
      return { error };
    }
  }

  public async postItem(body) {
    try {
      const cloneImages = cloneDeep(body.Images);
      body.ImageIds = body.Images.map(({ _id }) => _id);
      const document = await this.PlantModel.create(body);

      const tasks = cloneImages
        .filter(({ Temp }) => Temp)
        .map((tempImage) =>
          this.ImageService.uploadTempImageToFirebase({
            ...tempImage,
            ParentId: document._id,
          }),
        );

      await Promise.all(tasks);

      await document.populate(['Images']);
      document.populated('Images');

      const data = document.toJSON();

      return { data };
    } catch (error) {
      return { error };
    }
  }

  public async putItem(body) {
    try {
      const find = this.PlantModel.findById(body._id);
      const originDocument = await find.exec();
      const originData = originDocument.toJSON();

      const cloneImages = cloneDeep(body.Images);
      body.ImageIds = body.Images.map(({ _id }) => _id);

      const document = await this.PlantModel.findByIdAndUpdate(
        body._id,
        { $set: body },
        { new: true },
      );

      const wantToDeleteImages = difference<string>(
        originData.ImageIds.map((_id) => new Types.ObjectId(_id).toString()),
        body.ImageIds,
      );

      const tasks = cloneImages
        .filter(({ Temp }) => Temp)
        .map((tempImage) =>
          this.ImageService.uploadTempImageToFirebase({
            ...tempImage,
            ParentId: document._id,
          }),
        )
        .concat(
          wantToDeleteImages.map((_id) => this.ImageService.deleteImage(_id)),
        );

      await Promise.all(tasks);

      await document.populate(['Images']);
      document.populated('Images');

      const data = document.toJSON();

      return { data };
    } catch (error) {
      return { error };
    }
  }

  public async deleteItem(_id: string) {
    try {
      const document = await this.PlantModel.findByIdAndDelete(_id);
      const data = document.toJSON();
      data.ImageIds.forEach((_id) => {
        this.ImageService.deleteImage(_id);
      });
      return { data };
    } catch (error) {
      return { error };
    }
  }
}

import { Controller, Get, Query, Param, ValidationPipe } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageQueryDto } from '../../../../admin/src/features/image/dto/image-query.dto';

@Controller('image')
export class ImageController {
  constructor(private readonly ImageService: ImageService) {}
  @Get()
  async getList(
    @Query(
      new ValidationPipe({
        transform: true,
      }),
    )
    query: ImageQueryDto,
  ) {
    const { data, error } = await this.ImageService.getList(query);
    if (data) return data;
    if (error) throw error;
  }

  @Get(':_id')
  async getItem(@Param('_id') _id: string) {
    const { data, error } = await this.ImageService.getItem(_id);
    if (data) return data;
    if (error) throw error;
  }
}

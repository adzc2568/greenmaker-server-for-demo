import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { UploadImageDto, CropImageDto } from './dto/image.dto';
import { fileValidators } from '../../common/dto/upload-image.dto';

@ApiTags('image')
@Controller('image')
export class ImageController {
  constructor(private readonly ImageService: ImageService) {}
  @Post('upload-temp')
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('Image'))
  async uploadTempImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: fileValidators,
      }),
    )
    file: {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      buffer: Buffer;
      size: number;
    },
    @Body() body: UploadImageDto,
  ) {
    const { data, error } = await this.ImageService.uploadTempImage(file, body);

    if (data) return data;
    if (error) throw error;
  }

  @Post('crop-temp')
  async cropTempImage(@Body() body: CropImageDto) {
    this.ImageService.addCropTask(body);
    return HttpStatus.NO_CONTENT;
  }
}

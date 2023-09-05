import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Param,
  Body,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PlantService } from './plant.service';
import { PlantQueryDto, BasePlantDto, PlantWithIdDto } from './dto/plant.dto';

@ApiTags('plant')
@Controller('plant')
export class PlantController {
  constructor(private readonly PlantService: PlantService) {}
  @Get()
  async getList(
    @Query(
      new ValidationPipe({
        transform: true,
      }),
    )
    query: PlantQueryDto,
  ) {
    const { data, error } = await this.PlantService.getList(query);
    if (data) return data;
    if (error) throw error;
  }

  @Get(':_id')
  async getItem(@Param('_id') _id: string) {
    const { data, error } = await this.PlantService.getItem(_id);
    if (data) return data;
    if (error) throw error;
  }

  @Post()
  @UsePipes(ValidationPipe)
  async postItem(@Body() body: BasePlantDto) {
    const { data, error } = await this.PlantService.postItem(body);
    if (data) return data;
    if (error) throw error;
  }

  @Put()
  @UsePipes(ValidationPipe)
  async putItem(@Body() body: PlantWithIdDto) {
    const { data, error } = await this.PlantService.putItem(body);
    if (data) return data;
    if (error) throw error;
  }

  @Delete(':_id')
  async deleteItem(@Param('_id') _id: string) {
    const { data, error } = await this.PlantService.deleteItem(_id);
    if (data) return data;
    if (error) throw error;
  }
}

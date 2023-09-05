import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Param,
  Body,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WeatherService } from './weather.service';
import {
  WeatherQueryDto,
  CreateWeatherDto,
  UpdateWeatherDto,
} from './dto/weather.dto';
import { errorHandler } from 'common/methods/error-handler';
import { MongoQuery, MongoQueryModel } from 'nest-mongo-query-parser';

@ApiTags('weather')
@Controller('weather')
export class WeatherController {
  constructor(private readonly WeatherService: WeatherService) {}
  @Get()
  async getList(@MongoQuery() query: MongoQueryModel) {
    const { data, error } = await this.WeatherService.getList(query);
    if (data) return data;
    if (error) throw errorHandler(error);
  }

  @Get(':_id')
  async getItem(_id: string) {
    const { data, error } = await this.WeatherService.getItem(_id);
    if (data) return data;
    if (error) throw errorHandler(error);
  }

  // @Post()
  // async createItem(@Body() body: CreateWeatherDto) {
  //   const { data, error } = await this.WeatherService.createItem(body);
  //   if (data) return data;
  //   if (error) throw errorHandler(error);
  // }

  // @Put()
  // async updateItem(@Body() body: UpdateWeatherDto) {
  //   const { data, error } = await this.WeatherService.updateItem(body);
  //   if (data) return data;
  //   if (error) throw errorHandler(error);
  // }

  // @Delete(':_id')
  // async deleteItem(@Param('_id') _id: string) {
  //   const { data, error } = await this.WeatherService.deleteItem(_id);
  //   if (data) return data;
  //   if (error) throw errorHandler(error);
  // }
}

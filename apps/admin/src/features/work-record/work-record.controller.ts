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
import { WorkRecordService } from './work-record.service';
import {
  WorkRecordQueryDto,
  CreateWorkRecordDto,
  UpdateWorkRecordDto,
} from './dto/work-record.dto';
import { errorHandler } from 'common/methods/error-handler';
import { MongoQuery, MongoQueryModel } from 'nest-mongo-query-parser';

@ApiTags('work-record')
@Controller('work-record')
export class WorkRecordController {
  constructor(private readonly WorkRecordService: WorkRecordService) {}
  @Get()
  async getList(@MongoQuery() query: MongoQueryModel) {
    const { data, error } = await this.WorkRecordService.getList(query);
    if (data) return data;
    if (error) throw errorHandler(error);
  }

  @Get(':_id')
  async getItem(_id: string) {
    const { data, error } = await this.WorkRecordService.getItem(_id);
    if (data) return data;
    if (error) throw errorHandler(error);
  }

  @Post()
  async createItem(@Body() body: CreateWorkRecordDto) {
    const { data, error } = await this.WorkRecordService.createItem(body);
    if (data) return data;
    if (error) throw errorHandler(error);
  }

  @Put()
  async updateItem(@Body() body: UpdateWorkRecordDto) {
    const { data, error } = await this.WorkRecordService.updateItem(body);
    if (data) return data;
    if (error) throw errorHandler(error);
  }

  @Delete(':_id')
  async deleteItem(@Param('_id') _id: string) {
    const { data, error } = await this.WorkRecordService.deleteItem(_id);
    if (data) return data;
    if (error) throw errorHandler(error);
  }
}

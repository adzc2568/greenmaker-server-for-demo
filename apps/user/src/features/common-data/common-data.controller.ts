import { Controller, Get, Query, Param, ValidationPipe } from '@nestjs/common';
import { CommonDataService } from './common-data.service';
import { CommonDataQueryDto } from '../../../../admin/src/features/common-data/dto/common-data.dto';

@Controller('common-data')
export class CommonDataController {
  constructor(private readonly CommonDataService: CommonDataService) {}
  @Get()
  async getList(
    @Query(
      new ValidationPipe({
        transform: true,
      }),
    )
    query: CommonDataQueryDto,
  ) {
    const { data, error } = await this.CommonDataService.getList(query);
    if (data) return data;
    if (error) throw error;
  }

  @Get(':_id')
  async getItem(_id: string) {
    const { data, error } = await this.CommonDataService.getItem(_id);
    if (data) return data;
    if (error) throw error;
  }
}

@Controller('list')
export class ListController {
  constructor(private readonly CommonDataService: CommonDataService) {}

  @Get(':Category')
  async getListAll(@Param('Category') Category: string) {
    const { data, error } = await this.CommonDataService.getListAll(Category);
    if (data) return data;
    if (error) throw error;
  }
}

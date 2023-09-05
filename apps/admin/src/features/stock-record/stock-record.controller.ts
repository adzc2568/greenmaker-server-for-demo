import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StockRecordService } from './stock-record.service';
import { StockRecordQueryDto } from './dto/stock-record.dto';
import { errorHandler } from 'common/methods/error-handler';

@ApiTags('stock-record')
@Controller('stock-record')
export class StockRecordController {
  constructor(private readonly StockRecordService: StockRecordService) {}

  @Get()
  async getList(
    @Query(
      new ValidationPipe({
        transform: true,
      }),
    )
    query: StockRecordQueryDto,
  ) {
    const { data, error } = await this.StockRecordService.getList(query);
    if (data) return data;
    if (error) throw errorHandler(error);
  }
}

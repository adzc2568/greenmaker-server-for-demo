import { Test, TestingModule } from '@nestjs/testing';
import { StockRecordController } from './stock-record.controller';

describe('StockRecordController', () => {
  let controller: StockRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockRecordController],
    }).compile();

    controller = module.get<StockRecordController>(StockRecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

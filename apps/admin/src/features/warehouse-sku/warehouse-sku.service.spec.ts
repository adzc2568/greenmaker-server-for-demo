import { Test, TestingModule } from '@nestjs/testing';
import { WarehouseSkuService } from './warehouse-sku.service';

describe('WarehouseSkuService', () => {
  let service: WarehouseSkuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WarehouseSkuService],
    }).compile();

    service = module.get<WarehouseSkuService>(WarehouseSkuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

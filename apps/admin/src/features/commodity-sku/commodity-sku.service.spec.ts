import { Test, TestingModule } from '@nestjs/testing';
import { CommoditySkuService } from './commodity-sku.service';

describe('CommoditySkuService', () => {
  let service: CommoditySkuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommoditySkuService],
    }).compile();

    service = module.get<CommoditySkuService>(CommoditySkuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

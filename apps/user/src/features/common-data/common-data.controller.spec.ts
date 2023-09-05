import { Test, TestingModule } from '@nestjs/testing';
import { CommonDataController } from './common-data.controller';

describe('CommonDataController', () => {
  let controller: CommonDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommonDataController],
    }).compile();

    controller = module.get<CommonDataController>(CommonDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { WorkRecordService } from './work-record.service';

describe('WorkRecordService', () => {
  let service: WorkRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkRecordService],
    }).compile();

    service = module.get<WorkRecordService>(WorkRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

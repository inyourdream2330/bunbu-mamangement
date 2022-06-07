import { Test, TestingModule } from '@nestjs/testing';
import { DayOffService } from './days-off.service';

describe('DayOffService', () => {
  let service: DayOffService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DayOffService],
    }).compile();

    service = module.get<DayOffService>(DayOffService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

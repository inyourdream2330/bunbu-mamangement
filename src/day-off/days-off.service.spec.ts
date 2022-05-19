import { Test, TestingModule } from '@nestjs/testing';
import { DaysOffService } from './days-off.service';

describe('DayOffService', () => {
  let service: DaysOffService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DaysOffService],
    }).compile();

    service = module.get<DaysOffService>(DaysOffService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

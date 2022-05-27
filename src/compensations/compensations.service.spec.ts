import { Test, TestingModule } from '@nestjs/testing';
import { CompensationsService } from './compensations.service';

describe('CompensationsService', () => {
  let service: CompensationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompensationsService],
    }).compile();

    service = module.get<CompensationsService>(CompensationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

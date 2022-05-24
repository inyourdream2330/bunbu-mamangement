import { Test, TestingModule } from '@nestjs/testing';
import { CompensationsController } from './compensations.controller';
import { CompensationsService } from './compensations.service';

describe('CompensationsController', () => {
  let controller: CompensationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompensationsController],
      providers: [CompensationsService],
    }).compile();

    controller = module.get<CompensationsController>(CompensationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

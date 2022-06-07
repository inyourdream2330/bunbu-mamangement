import { Test, TestingModule } from '@nestjs/testing';
import { DaysOffController } from './days-off.controller';
import { DayOffService } from './days-off.service';

describe('DayOffController', () => {
  let controller: DaysOffController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DaysOffController],
      providers: [DayOffService],
    }).compile();

    controller = module.get<DaysOffController>(DaysOffController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

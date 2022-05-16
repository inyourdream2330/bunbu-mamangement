import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';

describe('UserController', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should be defined', () => {});
});

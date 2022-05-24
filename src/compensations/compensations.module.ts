import { Module } from '@nestjs/common';
import { CompensationsService } from './compensations.service';
import { CompensationsController } from './compensations.controller';

@Module({
  controllers: [CompensationsController],
  providers: [CompensationsService]
})
export class CompensationsModule {}

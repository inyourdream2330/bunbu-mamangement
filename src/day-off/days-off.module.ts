import { Module } from '@nestjs/common';
import { DayOffService } from './days-off.service';
import { DaysOffController } from './days-off.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DayOff } from './entities/days-off.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DayOff])],
  controllers: [DaysOffController],
  providers: [DayOffService],
  exports: [DayOffService],
})
export class DayOffModule {}

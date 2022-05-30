import { Module } from '@nestjs/common';
import { DaysOffService } from './days-off.service';
import { DaysOffController } from './days-off.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DayOff } from './entities/days-off.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DayOff])],
  controllers: [DaysOffController],
  providers: [DaysOffService],
  exports: [DaysOffService],
})
export class DayOffModule {}

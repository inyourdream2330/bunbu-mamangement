import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Overtime } from './entities/overtime.entity';
import { OvertimesController } from './overtimes.controller';
import { OvertimesService } from './overtimes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Overtime, User])],
  controllers: [OvertimesController],
  providers: [OvertimesService],
})
export class OvertimesModule {}

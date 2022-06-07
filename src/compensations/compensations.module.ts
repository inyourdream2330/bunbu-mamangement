import { Module } from '@nestjs/common';
import { CompensationsService } from './compensations.service';
import { CompensationsController } from './compensations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Compensation } from './entities/compensation.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Compensation, User])],
  controllers: [CompensationsController],
  providers: [CompensationsService],
})
export class CompensationsModule {}

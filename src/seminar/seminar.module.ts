import { Module } from '@nestjs/common';
import { SeminarController } from './seminar.controller';
import { SeminarService } from './seminar.service';

@Module({
  imports: [],
  controllers: [SeminarController],
  providers: [SeminarService],
})
export class SeminarModule {}

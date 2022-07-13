import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SeminarModule } from './seminar/seminar.module';

@Module({
  imports: [SeminarModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

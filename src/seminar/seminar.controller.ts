import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SeminarService } from './seminar.service';
const random = require('random');
import { AwesomeInterceptor } from './interceptor/awsome.interceptor';
import { AwesomeGuard } from './guard/awesome.guard';

@Controller('highland')
export class SeminarController {
  constructor(private readonly seminarService: SeminarService) {}
  @UseGuards(AwesomeGuard)
  @UseInterceptors(AwesomeInterceptor)
  @Get()
  getRD() {
    const people = [
      'Hưng',
      'Trung',
      'Đai',
      'Đức Nam',
      'Dương',
      'Thành Nam',
      'Lâm',
    ];
    return people[random.int(0, 5)];
  }

  @UseGuards(AwesomeGuard)
  @UseInterceptors(AwesomeInterceptor)
  @Get('/:name')
  getByP(@Param('name') name: string) {
    return name;
  }
}

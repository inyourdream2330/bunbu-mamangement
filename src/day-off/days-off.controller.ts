import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { GetCurrentUser } from '../auth/decorator/getCurrentUser.decorator';
import { TransformInterceptor } from '../interceptor/transform.interceptor';
import { DayOffService } from './days-off.service';
import { CreateDayOffDto } from './dto/create-day-off.dto';

@Controller('days-off')
export class DaysOffController {
  constructor(private readonly dayOffService: DayOffService) {}

  @Post()
  @UseInterceptors(TransformInterceptor)
  createDayOff(
    @Body() createDayOffDto: CreateDayOffDto,
    @GetCurrentUser() user,
  ) {
    return this.dayOffService.createDayOff(createDayOffDto, user.id);
  }
}

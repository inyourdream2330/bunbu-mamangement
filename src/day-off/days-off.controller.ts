import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { GetCurrentUser } from '../auth/decorator/getCurrentUser.decorator';
import { TransformInterceptor } from '../interceptor/transform.interceptor';
import { DaysOffService } from './days-off.service';
import { DayOffDto } from './dto/day-off.dto';

@Controller('days-off')
export class DaysOffController {
  constructor(private readonly daysOffService: DaysOffService) {}

  @Post()
  @UseInterceptors(TransformInterceptor)
  createDayOff(@Body() createDayOffDto: DayOffDto, @GetCurrentUser() user) {
    return this.daysOffService.createDayOff(createDayOffDto, user.id);
  }

  @Delete(':id')
  @UseInterceptors(TransformInterceptor)
  deleteDayOff(@Param('id') id: string) {
    return this.daysOffService.deleteDayOff(+id);
  }
}

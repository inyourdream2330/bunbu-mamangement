import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { GetCurrentUser } from '../auth/decorator/getCurrentUser.decorator';
import { TransformInterceptor } from '../interceptor/transform.interceptor';
import { DaysOffService } from './days-off.service';
import { CreateDayOffDto } from './dto/create-day-off.dto';
import { isDateParam } from './dto/date-param.dto';
import { UpdateDayOffDto } from './dto/update-day-off.dto';

@Controller('days-off')
export class DaysOffController {
  constructor(private readonly daysOffService: DaysOffService) {}

  @Post()
  @UseInterceptors(TransformInterceptor)
  createDayOff(
    @Body() createDayOffDto: CreateDayOffDto,
    @GetCurrentUser() user,
  ) {
    return this.daysOffService.createDayOff(createDayOffDto, user.id);
  }

  @Get()
  @UseInterceptors(TransformInterceptor)
  getDaysOff(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('from', new DefaultValuePipe('')) from: string,
    @Query('to', new DefaultValuePipe('')) to: string,
    @Query('name', new DefaultValuePipe('')) name: string,
  ) {
    return this.daysOffService.findDaysOff(page, limit, from, to, name);
  }

  @Put(':id')
  @UseInterceptors(TransformInterceptor)
  updateDayOff(
    @Param('id') id: string,
    @Body() updateDayOffDto: UpdateDayOffDto,
  ) {
    return this.daysOffService.updateDayOff(+id, updateDayOffDto);
  }
}

import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
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
import { DaysOffFindQueryDTO } from './dto/findQuery.dto';
import { UpdateDayOffDto } from './dto/update-day-off.dto';
import { updateStatusDto } from './dto/update-status.dto';

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
    // @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    // @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    // @Query('from', new DefaultValuePipe('')) from: string,
    // @Query('to', new DefaultValuePipe('')) to: string,
    // @Query('name', new DefaultValuePipe('')) name: string,
    // @Query('user_id', new DefaultValuePipe(-1), ParseIntPipe) user_id: number,
    @Query() query: DaysOffFindQueryDTO,
  ) {
    return this.daysOffService.findDaysOff(query);
  }

  @Put(':id')
  @UseInterceptors(TransformInterceptor)
  updateDayOff(
    @Param('id') id: string,
    @Body() updateDayOffDto: UpdateDayOffDto,
  ) {
    return this.daysOffService.updateDayOff(+id, updateDayOffDto);
  }

  @Get(':id')
  @UseInterceptors(TransformInterceptor)
  findDayOffById(@Param('id') id: string) {
    return this.daysOffService.findDayOffById(+id);
  }

  // @Get('/user/:id')
  // @UseInterceptors(TransformInterceptor)
  // findDaysOffByUser(
  //   @Param('id') id: string,
  //   @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  //   @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  //   @Query('from', new DefaultValuePipe('')) from: string,
  //   @Query('to', new DefaultValuePipe('')) to: string,
  // ) {
  //   return this.daysOffService.findDaysOffByUser(+id, page, limit, from, to);
  // }

  @Delete(':id')
  @UseInterceptors(TransformInterceptor)
  deleteDayOff(@Param('id') id: string) {
    return this.daysOffService.deleteDaysOff(+id);
  }

  @Put(':id/status')
  @UseInterceptors(TransformInterceptor)
  updateDayOffStatus(
    @Body() updateStatusDto: updateStatusDto,
    @Param('id') id: string,
  ) {
    return this.daysOffService.updateStatus(+id, updateStatusDto);
  }
}

import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { GetCurrentUser } from '../auth/decorator/getCurrentUser.decorator';
import { TransformInterceptor } from '../interceptor/transform.interceptor';
import { CompensationsService } from './compensations.service';
import { CompensationDto } from './dto/compensation.dto';
import { FindCompensationsQueryDto } from './dto/findCompensationQuery.dto';

@Controller('compensations')
export class CompensationsController {
  constructor(private readonly compensationsService: CompensationsService) {}

  @Post()
  @UseInterceptors(TransformInterceptor)
  creteCompensation(@Body() dto: CompensationDto, @GetCurrentUser() user) {
    return this.compensationsService.createCompensation(dto, user.id);
  }

  @Get()
  @UseInterceptors(TransformInterceptor)
  findDayOffs(@Query() query: FindCompensationsQueryDto) {
    return this.compensationsService.findCompensations(query);
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { GetCurrentUser } from '../auth/decorator/getCurrentUser.decorator';
import { TransformInterceptor } from '../interceptor/transform.interceptor';
import { CompensationsService } from './compensations.service';
import { CompensationDto } from './dto/compensation.dto';

@Controller('compensations')
export class CompensationsController {
  constructor(private readonly compensationsService: CompensationsService) {}

  @Post()
  @UseInterceptors(TransformInterceptor)
  creteCompensation(@Body() dto: CompensationDto, @GetCurrentUser() user) {
    return this.compensationsService.createCompensation(dto, user.id);
  }

  @Get(':id')
  @UseInterceptors(TransformInterceptor)
  getCompensation(@Param('id') id: string) {
    return this.compensationsService.findOneCompensationById(+id);
  }
}

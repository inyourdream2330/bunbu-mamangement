import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { GetCurrentUser } from '../auth/decorator/getCurrentUser.decorator';
import { TransformInterceptor } from '../interceptor/transform.interceptor';
import { OvertimeDto } from './dto/overtime.dto';
import { OvertimesService } from './overtimes.service';

@Controller('overtimes')
export class OvertimesController {
  constructor(private readonly overtimesService: OvertimesService) {}

  @Post()
  @UseInterceptors(TransformInterceptor)
  createOvertime(@Body() dto: OvertimeDto, @GetCurrentUser() user: any) {
    return this.overtimesService.createOvertime(dto, user.id);
  }
}

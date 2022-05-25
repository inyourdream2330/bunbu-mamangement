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
import { CompensationsService } from './compensations.service';
import { CreateCompensationDto } from './dto/create-compensation.dto';

@Controller('compensations')
export class CompensationsController {
  constructor(private readonly compensationsService: CompensationsService) {}

  @Post()
  @UseInterceptors(TransformInterceptor)
  creteCompensation(
    @Body() dto: CreateCompensationDto,
    @GetCurrentUser() user,
  ) {
    return this.compensationsService.createCompensation(dto, user.id);
  }

  @Put(':id')
  @UseInterceptors(TransformInterceptor)
  updateCompensation(
    @Body() dto: CreateCompensationDto,
    @Param('id') id: string,
  ) {
    return this.compensationsService.updateCompensation(dto, +id);
  }

  @Delete(':id')
  @UseInterceptors(TransformInterceptor)
  deleteConpensation(@Param('id') id: string) {
    return this.compensationsService.deleteCompensation(+id);
  }

  @Get()
  @UseInterceptors(TransformInterceptor)
  findCompensations(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('from', new DefaultValuePipe('')) from: string,
    @Query('to', new DefaultValuePipe('')) to: string,
    @Query('user_id', new DefaultValuePipe(-1), ParseIntPipe) user_id: number,
  ) {
    return this.compensationsService.findCompensations(
      page,
      limit,
      from,
      to,
      user_id,
    );
  }
}

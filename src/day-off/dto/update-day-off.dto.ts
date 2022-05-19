import { PartialType } from '@nestjs/swagger';
import { CreateDayOffDto } from './create-day-off.dto';

export class UpdateDayOffDto extends PartialType(CreateDayOffDto) {}

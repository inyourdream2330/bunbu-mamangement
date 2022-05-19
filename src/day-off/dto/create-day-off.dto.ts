import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateDayOffDto {
  @IsNotEmpty()
  @IsDateString()
  date: string;
  @IsNotEmpty()
  reasons: string;
  @IsNotEmpty()
  status: number;
  @IsNotEmpty()
  day_off_type: number;
}

import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateDayOffDto {
  @IsNotEmpty()
  @IsDateString()
  date: string;
  @IsNotEmpty()
  reasons: string;

  @IsNotEmpty()
  day_off_type: number;
}

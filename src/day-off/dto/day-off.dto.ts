import { IsDateString, IsNotEmpty } from 'class-validator';

export class DayOffDto {
  @IsNotEmpty()
  @IsDateString()
  date: string;
  @IsNotEmpty()
  reasons: string;
  @IsNotEmpty()
  type: number;
}

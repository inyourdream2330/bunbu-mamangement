import { IsISO8601, IsNotEmpty } from 'class-validator';

export class DayOffDto {
  @IsNotEmpty()
  @IsISO8601({ strict: true })
  date: string;
  @IsNotEmpty()
  reasons: string;
  @IsNotEmpty()
  type: number;
}

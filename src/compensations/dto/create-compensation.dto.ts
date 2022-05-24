import { IsDateString, IsNotEmpty, Matches } from 'class-validator';

export class CreateCompensationDto {
  @IsNotEmpty()
  @IsDateString()
  date: string;
  @IsNotEmpty()
  @IsDateString()
  for_date: string;
  @Matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
  start_at: string;
  @Matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
  end_at: string;
}

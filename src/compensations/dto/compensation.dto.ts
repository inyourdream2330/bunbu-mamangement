import { IsDateString, IsISO8601, IsNotEmpty, Matches } from 'class-validator';

export class CompensationDto {
  @IsNotEmpty()
  @IsISO8601({ strict: true })
  date: string;
  @IsNotEmpty()
  @IsISO8601({ strict: true })
  for_date: string;
  @IsNotEmpty()
  @Matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'start_at must be time string HH-MM',
  })
  start_at: string;
  @IsNotEmpty()
  @Matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'end_at must be time string HH-MM',
  })
  end_at: string;
}

import { IsDateString, IsNotEmpty, Matches } from 'class-validator';
import { REGEX_TIME_HHMM } from '../../constant/constant';

export class OvertimeDto {
  @IsNotEmpty()
  @IsDateString()
  date: string;
  @IsNotEmpty()
  @Matches(REGEX_TIME_HHMM, {
    message: 'start_at must be time string HH-MM',
  })
  start_at: string;
  @IsNotEmpty()
  @Matches(REGEX_TIME_HHMM, {
    message: 'end_at must be time string HH-MM',
  })
  end_at: string;
}

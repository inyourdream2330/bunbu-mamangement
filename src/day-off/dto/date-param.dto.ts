import { IsDateString } from 'class-validator';

export class isDateParam {
  @IsDateString()
  from?: string;
  @IsDateString()
  to?: string;
}

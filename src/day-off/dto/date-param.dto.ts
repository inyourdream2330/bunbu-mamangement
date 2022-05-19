import { IsDateString, IsNotEmpty } from 'class-validator';

export class isDateParam {
  // @IsDateString()
  @IsNotEmpty()
  from: string;
  // @IsDateString()
  @IsNotEmpty()
  to: string;
}

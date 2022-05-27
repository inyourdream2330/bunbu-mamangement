import { IsDateString, IsNumberString, IsOptional } from 'class-validator';

export class DaysOffFindQueryDTO {
  @IsNumberString()
  @IsOptional()
  page: number;

  @IsNumberString()
  @IsOptional()
  limit: number;

  @IsDateString()
  @IsOptional()
  from: string;

  @IsDateString()
  @IsOptional()
  to: string;

  @IsNumberString()
  @IsOptional()
  user_id: number;
}

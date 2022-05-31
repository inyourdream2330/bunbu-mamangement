import { IsISO8601, IsNumberString, IsOptional } from 'class-validator';

export class FindDaysOffQueryDTO {
  @IsNumberString()
  @IsOptional()
  page: number;

  @IsNumberString()
  @IsOptional()
  limit: number;

  @IsISO8601({ strict: true })
  @IsOptional()
  from: string;

  @IsISO8601({ strict: true })
  @IsOptional()
  to: string;

  @IsNumberString()
  @IsOptional()
  user_id: number;
}

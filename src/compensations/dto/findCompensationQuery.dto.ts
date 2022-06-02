import {
  IsISO8601,
  IsNumberString,
  IsOptional,
  Matches,
} from 'class-validator';

export class FindCompensationsQueryDto {
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

  @IsOptional()
  @Matches(/^asc$|^desc$/i, {
    message: 'sort accept only ASC or DESC',
  })
  sort: any;
  @IsOptional()
  sort_by: string;
}

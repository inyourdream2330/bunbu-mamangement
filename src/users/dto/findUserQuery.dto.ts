import { IsOptional, Matches } from 'class-validator';

export class findUsersQueryDto {
  @IsOptional()
  page: number;
  @IsOptional()
  limit: number;
  @IsOptional()
  name: string;
  @IsOptional()
  email: string;
  @IsOptional()
  code: string;
  @IsOptional()
  @Matches(/^asc$|^desc$/i, {
    message: 'sort accept only ASC or DESC',
  })
  sort: any;
  @IsOptional()
  sort_by: string;
}

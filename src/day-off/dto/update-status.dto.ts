import { IsNotEmpty, IsNumber } from 'class-validator';

export class updateStatusDto {
  @IsNotEmpty()
  @IsNumber()
  status: number;
}

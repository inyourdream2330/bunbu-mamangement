import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  gender: number;
  @IsNotEmpty()
  position: number;
  @IsNotEmpty()
  id_card: string;
  @IsNotEmpty()
  address: string;
  @IsNotEmpty()
  joining_date: string;
  @IsNotEmpty()
  dob: string;
  @IsNotEmpty()
  status: number;

  phone: string;
  @IsNotEmpty()
  contract_type: number;
  @IsNotEmpty()
  official_date: string;
  @IsNotEmpty()
  role: number;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}

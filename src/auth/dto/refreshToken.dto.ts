import { IsNotEmpty, IsString, IsEmail, IsNumberString } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  refresh_token: string;
}

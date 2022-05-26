import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { REGEX_JWT } from '../../constant/constant';

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  @Matches(REGEX_JWT, { message: 'Refresh token malformed' })
  refresh_token: string;
}

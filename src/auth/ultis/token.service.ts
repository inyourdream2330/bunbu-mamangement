import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN_DEFAULT,
  REFRESH_TOKEN_EXPIRES_IN_REMEMBER,
} from '../../constant/constant';
import { JwtPayload, Tokens } from '../types';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}
  createAccessToken(jwtPayload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(jwtPayload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
  }
  createRefreshToken(
    jwtPayload: JwtPayload,
    remember: boolean,
  ): Promise<string> {
    return this.jwtService.signAsync(jwtPayload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn:
        remember === true
          ? REFRESH_TOKEN_EXPIRES_IN_REMEMBER
          : REFRESH_TOKEN_EXPIRES_IN_DEFAULT,
    });
  }

  async getTokens(
    userId: number,
    email: string,
    role: number,
    remember: boolean,
  ): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      id: userId,
      email,
      role,
      remember,
    };
    const [access_token, refresh_token] = await Promise.all([
      this.createAccessToken(jwtPayload),
      this.createRefreshToken(jwtPayload, remember),
    ]);

    return { access_token, refresh_token };
  }

  // getRawToken(token: string) {
  //   return token.replace('Bearer', '').trim();
  // }
}

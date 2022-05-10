import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dto/auth.dto';
import { JwtPayload, Tokens } from './types';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }
  async login(dto: AuthDto, res: Response) {
    const user = (await this.usersService.findOneByEmail(dto.email)).data;
    if (!user) {
      throw new InternalServerErrorException('User not exist');
    }

    const passwordMathched = await argon2.verify(user.password, dto.password);
    if (!passwordMathched) {
      throw new InternalServerErrorException('pw sai cmnr');
    }
    const tokens = await this.getTokens(
      user.id,
      user.email,
      user.role,
      dto.remember,
    );
    res.cookie('refresh_token', tokens.refresh_token);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
    return { data: tokens, message: 'Login Success' };
  }

  async updateRefreshTokenHash(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    const hashRefreshToken = await argon2.hash(refreshToken);
    this.usersService.updateHashRefreshToken(userId, hashRefreshToken);
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

  getRawToken(token: string) {
    return token.replace('Bearer', '').trim();
  }

  createAccessToken(jwtPayload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(jwtPayload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: '15m',
    });
  }
  createRefreshToken(
    jwtPayload: JwtPayload,
    remember: boolean,
  ): Promise<string> {
    return this.jwtService.signAsync(jwtPayload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: remember === true ? '30d' : '1d',
    });
  }
}

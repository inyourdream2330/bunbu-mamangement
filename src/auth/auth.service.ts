import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto/auth.dto';
import { TokenService } from './ultis/token.service';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }
  async login(dto: AuthDto, res: Response) {
    const user = (await this.usersService.findOneByEmail(dto.email)).data;
    if (!user) {
      throw new UnauthorizedException('User not exist');
    }

    const passwordMathched = await argon2.verify(user.password, dto.password);
    if (!passwordMathched) {
      throw new UnauthorizedException('Password incorrect');
    }
    const tokens = await this.tokenService.getTokens(
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

  async logout(req, res) {
    this.usersService.updateHashRefreshToken(req.user.id, '');
    res.clearCookie('refresh_token');
    return { message: 'Logout Success', data: [] };
  }

  async refreshTokens(refresh_token: string, res) {
    const jwtPayload = await this.jwtService.verifyAsync(refresh_token, {
      publicKey: process.env.REFRESH_TOKEN_SECRET,
      ignoreExpiration: true,
    });
    const user = (await this.usersService.findOneById(jwtPayload.id)).data;
    if (!user || !user.hash_refresh_token) {
      throw new UnauthorizedException('Access Denied');
    }
    const matchRefreshToken = await argon2.verify(
      user.hash_refresh_token,
      refresh_token,
    );
    if (!matchRefreshToken) {
      throw new UnauthorizedException('Refresh token not match in database');
    }
    if (Date.now() >= jwtPayload.exp * 1000) {
      this.usersService.updateHashRefreshToken(jwtPayload.id, '');
      throw new UnauthorizedException('Login session expired');
    }

    const tokens = await this.tokenService.getTokens(
      user.id,
      user.email,
      user.role,
      jwtPayload.remember,
    );
    res.cookie('refresh_token', tokens.refresh_token);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
    return { data: tokens, message: 'Refresh token success' };
  }
}

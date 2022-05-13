import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto/auth.dto';
import { clearDB } from './ultis/DB.service';
import { TokenService } from './ultis/token.service';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
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
}

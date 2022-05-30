import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { TransformInterceptor } from '../interceptor/transform.interceptor';
import { AuthService } from './auth.service';
import { Public } from './decorator/isPublic.decorator';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransformInterceptor)
  @Post('login')
  signin(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    return this.authService.login(dto, res);
  }

  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransformInterceptor)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response, @Request() req: Request) {
    return this.authService.logout(req, res);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('refresh')
  @UseInterceptors(TransformInterceptor)
  refreshTokens(
    @Body() dto: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshTokens(dto.refresh_token, res);
  }
}

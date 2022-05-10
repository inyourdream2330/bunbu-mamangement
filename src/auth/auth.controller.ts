import { Body, Controller, Post, Res, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { TransformInterceptor } from 'src/interceptor/transform.interceptor';
import { AuthService } from './auth.service';
import { Public } from './decorator/isPublic.decorator';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseInterceptors(TransformInterceptor)
  @Post('login')
  signin(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    return this.authService.login(dto, res);
  }
}

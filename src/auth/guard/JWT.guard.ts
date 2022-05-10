import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/constant/StatusConstant.constant';

@Injectable()
export class JWTGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest(err, user, info, context) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (isPublic) return true;

    if (user) {
      if (roles) {
        if (roles.includes(user.role)) {
          return user;
        } else {
          throw new BadRequestException('Permission denied');
        }
      } else {
        return user;
      }
    }
    throw new BadRequestException();
  }
}

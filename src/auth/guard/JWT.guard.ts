import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../../constant/constant';

@Injectable()
export class JWTGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest(err, user, info: Error, context) {
    if (err) {
      throw new InternalServerErrorException(err);
    }
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
          throw new UnauthorizedException('Permission denied');
        }
      } else {
        return user;
      }
    }
    throw new UnauthorizedException(info.message);
  }
}

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AwesomeGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const excludedName = ['lam', 'Lam', 'Lâm'];
    if (excludedName.includes(request.params.name)) {
      return false;
    }
    return true;
  }
}

import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Log the request for debugging
    const request = context.switchToHttp().getRequest();
    this.logger.debug(`Auth request path: ${request.path}`);
    this.logger.debug(`Auth headers: ${JSON.stringify(request.headers)}`);

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any) {
    if (err || !user) {
      this.logger.error(`Auth error: ${err?.message || 'No user found'}`);
      this.logger.error(`Auth info: ${JSON.stringify(info)}`);
    } else {
      this.logger.debug(`Auth success for user: ${JSON.stringify(user)}`);
    }
    
    return super.handleRequest(err, user, info, context, status);
  }
}

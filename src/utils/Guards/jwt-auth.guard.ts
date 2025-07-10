import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<Request>();
    const token = req.cookies['jwt'];
    console.log('[JwtAuthGuard] Received token:', token);
    if (!token) {
      console.warn('[JwtAuthGuard] No token found in cookies!');
      throw new UnauthorizedException('No token found!!');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token);
      req['user'] = payload;
      return true;
    } catch (err) {
      console.error('[JwtAuthGuard] Invalid token:', token, err);
      throw new UnauthorizedException('Invalid token');
    }
  }
}

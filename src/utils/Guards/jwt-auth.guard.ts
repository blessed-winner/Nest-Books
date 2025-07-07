import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";


@Injectable()
export class JwtAuthGuard implements CanActivate{
     constructor(private readonly jwtService:JwtService){}
     async canActivate(ctx: ExecutionContext):Promise<boolean> {
            const req = ctx.switchToHttp().getRequest<Request>()
            const token = req.cookies['jwt']
            if(!token) throw new UnauthorizedException('No token found!!')
            try{
               const payload = await this.jwtService.verifyAsync(token)
               req['user'] = payload
               return true
            }
            catch(err){
                throw new UnauthorizedException('Invalid token')
            }
     }
}
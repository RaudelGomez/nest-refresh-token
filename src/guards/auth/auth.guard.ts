import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/constants';
import { Roles_key } from 'src/decorator/roles.decorator';
import { Role } from 'src/enums/roles.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService:JwtService) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const reqPermission = this.reflector.getAllAndOverride<Role[]>(Roles_key, [
      context.getHandler(),
      context.getClass(),
    ])
    if(!reqPermission){
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const authToken = request.headers.authorization;
    if(!authToken){
      throw new UnauthorizedException('You do not have permission to watch')
    }
    const decodedToken = await this.jwtService.verifyAsync(authToken, {secret: jwtConstants.secret_access_token})
    console.log(decodedToken);
    return reqPermission.some((role) => decodedToken.roles?.includes(role));
  }
}

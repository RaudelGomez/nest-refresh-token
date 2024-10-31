import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/constants';
import { Roles_key } from 'src/decorator/roles.decorator';
import { Role } from 'src/enums/roles.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  // Se inyectan Reflector, que permite acceder a metadatos, 
  constructor(private reflector: Reflector, private jwtService:JwtService) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // canActivate se ejecuta en cada solicitud para decidir si se debe permitir o denegar el acceso.
    // Usa Reflector para recuperar el valor de los metadatos definidos con el decorador Roles en el controlador o el método de la ruta actual. Estos metadatos indican los roles requeridos para acceder a la ruta.
    const reqPermission = this.reflector.getAllAndOverride<Role[]>(Roles_key, [
      context.getHandler(),
      context.getClass(),
    ])
    //Sino hay roles es porque no se necesita en esta ruta, entonces lo dejo continuar. 
    //Importante usar esto en caso que no todas las rutas tengan configurado un rol especifico.
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
    // Comprueba si alguno de los roles en reqPermission está presente en el token decodificado del usuario. Si al menos uno coincide, permite el acceso devolviendo true; si ninguno coincide, devuelve false, denegando el acceso.
    return reqPermission.some((role) => decodedToken.roles?.includes(role));
  }
}

import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { jwtConstants } from 'src/constants/constants';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  
  async use(req: Request, res: Response, next: () => void) {
    const access_token = req.headers.authorization;
    // console.log(access_token);
    if (!access_token) {
      throw new UnauthorizedException('Authorization header missing');
    }

    try {
      // Verifica el token y también verifica si ha expirado
      const decoded = await this.jwtService.verifyAsync(access_token, {
        secret: jwtConstants.secret_access_token, // Asegúrate de usar la clave secreta correcta
      });
      console.log(decoded);
      // Si la verificación es correcta, deja continuar la solicitud
      // req.user = decoded; // Puedes almacenar el usuario decodificado en la solicitud si lo necesitas
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}

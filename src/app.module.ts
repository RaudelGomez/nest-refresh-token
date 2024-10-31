import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { PrismaService } from './services/prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { AuthMiddleware } from './middlewares/auth/auth.middleware';
import { AuthGuard } from './guards/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';

// Al utilizar { provide: APP_GUARD, useClass: AuthGuard } en el arreglo providers, NestJS registra AuthGuard como un guard global.
// Esto significa que AuthGuard se aplicará a todas las solicitudes entrantes en la aplicación, sin necesidad de agregar @UseGuards(AuthGuard) en los controladores o métodos individuales.
@Module({
  imports: [UsersModule],
  controllers: [],
  providers: [PrismaService, {
    provide: APP_GUARD,
    useClass: AuthGuard,
    },],
})

// Los middlewares no tienen acceso a la inyección de dependencias de Nest, lo que los hace adecuados para tareas generales y no específicas de un módulo.
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({path: 'users/all', method: RequestMethod.GET});
  }
}

import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { PrismaService } from './services/prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { AuthMiddleware } from './middlewares/auth/auth.middleware';
import { AuthGuard } from './guards/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [UsersModule],
  controllers: [],
  providers: [PrismaService, {
    provide: APP_GUARD,
    useClass: AuthGuard,
    },],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({path: 'users/all', method: RequestMethod.GET});
  }
}

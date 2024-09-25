import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaService } from './services/prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthMiddleware } from './middlewares/auth/auth.middleware';

@Module({
  imports: [UsersModule, DashboardModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('dashboard');
  }
}

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  imports: [JwtModule.register({
    global: true,
    // secret: 'secret password',
    // signOptions: { expiresIn: '60s' },
  }),]
})
export class UsersModule {}

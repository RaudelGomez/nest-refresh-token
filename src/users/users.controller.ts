import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/enums/roles.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @Post('refresh')
  refreshToken(@Body('refresh_token') refresh_token: string): Promise<{}> {
    return this.usersService.refreshToken(refresh_token);
  }

  // Su propósito principal es autorizar. Los guards determinan si una solicitud tiene permiso para acceder a una ruta específica y permiten o deniegan el acceso. Los guards pueden usarse para lógica de autorización, verificación de roles, permisos, etc.
  @Roles(Role.USER)
  @Get('all')
  findAll() {
    return this.usersService.findAll();
  }

  @Roles(Role.ADMIN)
  @Get('user/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

}

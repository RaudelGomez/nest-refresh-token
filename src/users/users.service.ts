import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { Role } from 'src/enums/roles.enum';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService){}

  async register(createUserDto: CreateUserDto) {
    const newUser = await this.prismaService.user.create({data: {...createUserDto, roles: [Role.USER]}}) 
    return newUser;
  }

  async login(loginUserDto: LoginUserDto) {
    const userLogged = await this.prismaService.user.findUnique({where: {email: loginUserDto.email}})
    return userLogged;
  }

  async findAll() {
    const allUsers = await this.prismaService.user.findMany();
    return allUsers;
  }

  async findOne(id: string) {
    const userFound = await this.prismaService.user.findUnique({where: {id: id}})
    return userFound;
  }

}

import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { Role } from 'src/enums/roles.enum';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/constants';

type Tokens = {
  access_token: string,
  refresh_token: string
}

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService, private readonly jwtService: JwtService){}

  async register(createUserDto: CreateUserDto) {
    const userExist = await this.prismaService.user.findUnique({where: {email: createUserDto.email}});
    if(userExist){
      throw new BadRequestException('User already exist');
    }
    const hashPasword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = await this.prismaService.user.create({data: {...createUserDto, password: hashPasword, roles: [Role.USER]}}) 
    return newUser;
  }

  async login(loginUserDto: LoginUserDto) {
    const userLogged = await this.prismaService.user.findUnique({where: {email: loginUserDto.email}});
    if (!userLogged){
      throw new UnauthorizedException('You are not authorized');
    }
    const isMatch = await bcrypt.compare(loginUserDto.password, userLogged.password);
    if(!isMatch){
      throw new BadRequestException('You password is wrong');
    }
    const {name, email, ...result} = userLogged;
    const payload = {sub: userLogged.email, roles: userLogged.roles}
    const {access_token, refresh_token} = await this.generateTokens(payload);
    return {message: 'Login successfully', name, email, access_token, refresh_token};
  }

  async refreshToken(refresh_token: string): Promise<{}>{
    try {
      const user = await this.jwtService.verifyAsync(refresh_token, {secret: jwtConstants.secret_refresh_token})
      const payload = {sub: user.sub, roles: user.roles}
      const new_access_token = await this.jwtService.signAsync(payload, {secret: jwtConstants.secret_access_token, expiresIn: '2m'});
      return {new_access_token};
    } catch (error) {
      throw new BadRequestException('Token invalid!')
    }
    
  }

  async findAll() {
    const allUsers = await this.prismaService.user.findMany();
    return allUsers;
  }

  async findOne(id: string) {
    const userFound = await this.prismaService.user.findUnique({where: {id: id}})
    return userFound;
  }

  private async generateTokens(payload: any): Promise<Tokens>{
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {secret: jwtConstants.secret_access_token, expiresIn: '2m'}),
      this.jwtService.signAsync(payload, {secret: jwtConstants.secret_refresh_token, expiresIn: '1d'})
    ])
    return {access_token, refresh_token}
  }

}

import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Role } from "src/enums/roles.enum";

export class CreateUserDto {
  @Transform(({value})=> value.trim())
  @IsString()
  name?: string;

  @Transform(({value})=> value.trim())
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Transform(({value})=> value.trim())
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  password: string;

  roles: Role[];
}

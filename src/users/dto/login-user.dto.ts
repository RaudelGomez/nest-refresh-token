import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginUserDto{
  @Transform(({value})=> value.trim())
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Transform(({value})=> value.trim())
  @IsNotEmpty()
  password: string;
}
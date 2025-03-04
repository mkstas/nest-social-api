import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsEmail({})
  readonly email: string;

  @MinLength(8)
  @IsString()
  readonly password: string;
}

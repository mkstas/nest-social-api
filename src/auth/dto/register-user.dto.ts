import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsEmail({})
  readonly email: string;

  @MinLength(8)
  @IsString()
  readonly password: string;

  @MinLength(1)
  @IsString()
  readonly userName: string;
}

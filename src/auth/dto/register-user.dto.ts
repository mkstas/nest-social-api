import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  /**
   * Email validation rules
   */
  @IsEmail({}, { message: 'Неверный формат почты' })
  readonly email: string;

  /**
   * Password validation rules
   */
  @MinLength(8, { message: 'Длина не менее 8 символов' })
  @IsString({ message: 'Пароль должен быть строкой' })
  readonly password: string;

  /**
   * UserName validation rules
   */
  @IsNotEmpty({ message: 'Имя не должно быть пустым' })
  @IsString({ message: 'Имя должно быть строкой' })
  readonly userName: string;
}

import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
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
}

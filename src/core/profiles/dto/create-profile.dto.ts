import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateProfileDto {
  /**
   * User id validation rules
   */
  @Min(1, { message: 'Минимальное значение должно быть 1' })
  @IsNumber({}, { message: 'Должен быть числом' })
  readonly userId: number;

  /**
   * UserName validation rules
   */
  @IsNotEmpty({ message: 'Имя не должно быть пустым' })
  @IsString({ message: 'Имя должно быть строкой' })
  readonly userName: string;
}

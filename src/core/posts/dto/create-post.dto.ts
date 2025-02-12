import { IsNumber, IsString, Min, MinLength } from 'class-validator';

export class CreatePostDto {
  @Min(1, { message: 'Минимальное значение должно быть 1' })
  @IsNumber({}, { message: 'Должен быть числом' })
  readonly userId: number;

  @MinLength(20, { message: 'Минимальная длина 20 символов' })
  @IsString({ message: 'Должен быть строкой' })
  readonly text: string;

  @IsNumber({}, { message: 'Должен быть числом' })
  readonly likeQuantity: number;

  @IsString({ message: 'Должен быть строкой' })
  readonly imageUrl: string;
}

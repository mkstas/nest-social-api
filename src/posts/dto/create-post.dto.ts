import { IsNumber, IsString, Min, MinLength } from 'class-validator';

export class CreatePostDto {
  @Min(1)
  @IsNumber()
  readonly userId: number;

  @MinLength(1)
  @IsString()
  readonly content: string;
}

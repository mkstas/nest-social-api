import { MinLength, IsString } from 'class-validator';

export class CreateArticleDto {
  @MinLength(1)
  @IsString()
  readonly title: string;

  @MinLength(1)
  @IsString()
  readonly content: string;
}

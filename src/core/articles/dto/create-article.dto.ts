import { MinLength, IsString } from 'class-validator';

export class CreateArticleDto {
  @MinLength(1)
  @IsString()
  readonly content: string;
}

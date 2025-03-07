import { IsNumber, IsString, Min, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsNumber()
  @Min(1)
  readonly articleId: number;

  @IsString()
  @MinLength(1)
  readonly message: string;
}

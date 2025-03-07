import { IsNumber, Min } from 'class-validator';

export class CreateLikeDto {
  @IsNumber()
  @Min(1)
  readonly userId: number;

  @IsNumber()
  @Min(1)
  readonly articleId: number;
}

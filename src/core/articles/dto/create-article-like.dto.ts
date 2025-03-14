import { IsNumber, Min } from 'class-validator';

export class CreateArticleLikeDto {
  @IsNumber()
  @Min(1)
  articleId: number;
}

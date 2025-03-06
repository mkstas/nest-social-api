import { IsNumber, Min } from 'class-validator';

export class LikePostDto {
  @IsNumber()
  @Min(1)
  readonly postId: number;

  @IsNumber()
  @Min(1)
  readonly userId: number;
}

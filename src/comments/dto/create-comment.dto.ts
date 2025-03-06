import { IsNumber, IsString, Min, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsNumber()
  @Min(1)
  readonly postId: number;

  @IsNumber()
  @Min(1)
  readonly userId: number;

  @IsString()
  @MinLength(1)
  readonly message: string;
}

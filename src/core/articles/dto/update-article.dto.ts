import { IsString, MinLength, IsOptional, IsBoolean } from 'class-validator';

export class UpdateArticleDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  readonly content: string;

  @IsBoolean()
  @IsOptional()
  readonly isHidden: boolean;
}

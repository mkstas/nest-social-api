import { MinLength, IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdatePostDto {
  @MinLength(1)
  @IsString()
  @IsOptional()
  readonly content: string;

  @IsBoolean()
  @IsOptional()
  readonly isHidden: boolean;
}

import { IsNumber, IsString, Min, MinLength } from 'class-validator';

export class CreateProfileDto {
  @IsNumber()
  @Min(1)
  readonly userId: number;

  @IsString()
  @MinLength(1)
  readonly userName: string;
}

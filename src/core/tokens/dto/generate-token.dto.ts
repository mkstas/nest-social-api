import { IsEmail, IsNumber, Min } from 'class-validator';

export class GenerateTokenDto {
  @IsNumber()
  @Min(1)
  sub: number;

  @IsEmail()
  email: string;
}

import { IsEmail, IsNumber, Min } from 'class-validator';

export class GenerateTokenDto {
  @Min(1)
  @IsNumber()
  sub: number;

  @IsEmail()
  email: string;
}

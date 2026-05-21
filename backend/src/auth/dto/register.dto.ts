import { IsEmail, IsNotEmpty, IsOptional, IsNumber, Min, Max, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(120)
  age?: number;
}

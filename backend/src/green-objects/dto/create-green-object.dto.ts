import { IsEnum, IsNotEmpty, IsOptional, IsNumber, IsString } from 'class-validator';
import { GreenObjectType } from '../green-object.entity';

export class CreateGreenObjectDto {
  @IsNotEmpty()
  name: string;

  @IsEnum(GreenObjectType)
  type: GreenObjectType;

  @IsNotEmpty()
  address: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  plantedYear?: number;
}

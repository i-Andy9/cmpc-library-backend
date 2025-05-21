import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsPositive,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsOptional()
  @IsString()
  publisher?: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @IsOptional()
  @IsBoolean()
  available?: boolean;

  @IsString()
  genre: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}

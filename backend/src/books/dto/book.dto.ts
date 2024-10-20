import { IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';

export class BookRequestDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsNotEmpty()
  @IsDateString()
  publicationDate: Date;

  @IsOptional()
  @IsString()
  coverUrl?: string;
}

export class BookResponseDto extends BookRequestDto {
    id: string;
    rating?: number;
}

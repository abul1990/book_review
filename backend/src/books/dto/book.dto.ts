import { IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';

export class BookRequestDto {
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
}

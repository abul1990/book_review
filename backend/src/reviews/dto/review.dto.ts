// src/reviews/dto/review.dto.ts
import { IsNotEmpty, IsOptional, IsInt, IsString, Max, Min } from 'class-validator';

export class ReviewRequestDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsNotEmpty()
  @IsString()
  reviewText: string;

  @IsNotEmpty()
  bookId: string;

  @IsNotEmpty()
  userId: string;
}

export class ReviewResponseDto {
  id: string;
  rating: number;
  reviewText: string;
  reviewDate: Date;
  bookId: string;
  userId: string;
}

export class UpdateReviewDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  reviewText?: string;
}

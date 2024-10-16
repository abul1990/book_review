// src/reviews/dto/review.dto.ts
import { IsNotEmpty, IsOptional, IsInt, IsString, Max, Min } from 'class-validator';
import { BookResponseDto } from 'src/books/dto/book.dto';
import { UserResponseDTO } from 'src/users/dto/user.dto';
import { User } from 'src/users/entities/user.entity';

export class ReviewRequestDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsNotEmpty()
  @IsString()
  comment: string;

  @IsNotEmpty()
  bookId: string;

  @IsNotEmpty()
  userId: string;
}

export class ReviewResponseDto {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  bookId: string;
  userId: string;
  book?: BookResponseDto;
  user?: UserResponseDTO;
}

export class UpdateReviewDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  comment?: string;
}

export class RatingDistribution {
  rating: number;
  count: number;
}

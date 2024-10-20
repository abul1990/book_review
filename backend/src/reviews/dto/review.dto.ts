import { IsNotEmpty, IsOptional, IsString, Max, Min, IsNumber } from 'class-validator';
import { BookResponseDto } from 'src/books/dto/book.dto';
import { UserResponseDTO } from 'src/users/dto/user.dto';

export class ReviewRequestDto {
  @IsNotEmpty()
  @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'Rating must be a valid number' })
  @Min(1)
  @Max(5)
  rating: number;

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
  @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'Rating must be a valid number' })
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

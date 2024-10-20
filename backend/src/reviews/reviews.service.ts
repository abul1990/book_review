import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/reviews.entity';
import {
  RatingDistribution,
  ReviewRequestDto,
  ReviewResponseDto,
  UpdateReviewDto,
} from './dto/review.dto';
import { plainToInstance } from 'class-transformer';
import { Book } from 'src/books/entities/books.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(reviewDto: ReviewRequestDto): Promise<ReviewResponseDto> {
    const book = await this.bookRepository.findOne({
      where: { id: reviewDto.bookId },
    });
    const user = await this.userRepository.findOne({
      where: { id: reviewDto.userId },
    });

    if (!book) throw new NotFoundException('Book not found');
    if (!user) throw new NotFoundException('User not found');

    const existingReview = await this.reviewRepository.findOne({
      where: { book: { id: reviewDto.bookId }, user: { id: reviewDto.userId } },
    });

    if (existingReview) {
      throw new ConflictException('User has already reviewed this book');
    }

    const newReview = plainToInstance(Review, {
      ...reviewDto,
      book,
      user,
      createdAt: new Date(),
    });
    const savedReview = await this.reviewRepository.save(newReview);
    return this.toResponseDTO(savedReview);
  }

  async findAll(): Promise<ReviewResponseDto[]> {
    const reviews = await this.reviewRepository.find({
      relations: ['book', 'user'],
      order: {
        createdAt: 'DESC',
      },
    });
    return reviews.map(this.toResponseDTO);
  }

  async findOne(id: string): Promise<ReviewResponseDto> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['book', 'user'],
    });
    if (!review) throw new NotFoundException('Review not found');
    return this.toResponseDTO(review);
  }

  async findByBookId(bookId: string): Promise<ReviewResponseDto[]> {
    const reviews = await this.reviewRepository.find({
      where: { book: { id: bookId } },
      relations: ['book', 'user'],
      order: {
        createdAt: 'DESC',
      },
    });
    return reviews.map(this.toResponseDTO);
  }

  async findByUserId(userId: string): Promise<ReviewResponseDto[]> {
    const reviews = await this.reviewRepository.find({
      where: { user: { id: userId } },
      relations: ['book', 'user'],
      order: {
        createdAt: 'DESC',
      },
    });
    return reviews.map(this.toResponseDTO);
  }

  async getRatingDistribution(bookId: string): Promise<RatingDistribution[]> {
    const reviews = await this.reviewRepository.find({
      where: { book: { id: bookId } },
    });
    const ratingDistribution = Array(5).fill(0);

    reviews.forEach((review) => {
      const roundedRating = Math.round(review.rating);
      if (roundedRating >= 1 && roundedRating <= 5) {
        ratingDistribution[roundedRating - 1]++;
      }
    });

    return ratingDistribution.map((count, index) => ({
      rating: index + 1,
      count,
    }));
  }

  async update(
    id: string,
    updateDto: UpdateReviewDto,
  ): Promise<ReviewResponseDto> {
    const review = await this.findOne(id);
    const updatedReview = plainToInstance(Review, { ...review, ...updateDto });
    const savedReview = await this.reviewRepository.save(updatedReview);
    return this.toResponseDTO(savedReview);
  }

  async remove(id: string): Promise<void> {
    const result = await this.reviewRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Review not found');
  }

  private toResponseDTO(review: Review): ReviewResponseDto {
    return {
      id: review.id,
      rating: Number(review.rating),
      comment: review.comment,
      createdAt: review.createdAt,
      bookId: review.book.id,
      userId: review.user.id,
      book: review.book,
      user: review.user,
    };
  }
}

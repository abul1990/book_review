import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/reviews.entity';
import { ReviewRequestDto, ReviewResponseDto, UpdateReviewDto } from './dto/review.dto';
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
    const book = await this.bookRepository.findOne({ where: { id: reviewDto.bookId } });
    const user = await this.userRepository.findOne({ where: { id: reviewDto.userId } });

    if (!book) throw new NotFoundException('Book not found');
    if (!user) throw new NotFoundException('User not found');

    const newReview = plainToInstance(Review, { ...reviewDto, book, user, reviewDate: new Date() });
    const savedReview = await this.reviewRepository.save(newReview);
    return this.toResponseDTO(savedReview);
  }

  async findAll(): Promise<ReviewResponseDto[]> {
    const reviews = await this.reviewRepository.find({ relations: ['book', 'user'] });
    return reviews.map(this.toResponseDTO);
  }

  async findOne(id: string): Promise<ReviewResponseDto> {
    const review = await this.reviewRepository.findOne({ where: { id }, relations: ['book', 'user'] });
    if (!review) throw new NotFoundException('Review not found');
    return this.toResponseDTO(review);
  }

  async update(id: string, updateDto: UpdateReviewDto): Promise<ReviewResponseDto> {
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
      rating: review.rating,
      reviewText: review.reviewText,
      reviewDate: review.reviewDate,
      bookId: review.book.id,
      userId: review.user.id,
    };
  }
}

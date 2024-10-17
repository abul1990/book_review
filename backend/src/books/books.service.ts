import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/books.entity';
import { BookRequestDto, BookResponseDto } from './dto/book.dto';
import { plainToInstance } from 'class-transformer';
import { RatingDistribution, ReviewResponseDto } from 'src/reviews/dto/review.dto';
import { ReviewsService } from 'src/reviews/reviews.service';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    private readonly reviewsService: ReviewsService,
  ) {}

  async create(bookDto: BookRequestDto): Promise<BookResponseDto> {
    const newBook = plainToInstance(Book, bookDto);
    const savedBook = await this.bookRepository.save(newBook);
    return this.toResponseDTO(savedBook);
  }

  async findAll(): Promise<BookResponseDto[]> {
    const books = await this.bookRepository.find();
    const reviews = await this.reviewsService.findAll();

    const reviewsByBookId = this.groupReviewsByBookId(reviews);
  
    return books.map((book) => {
      const bookReviews = reviewsByBookId[book.id] || [];
      const averageRating = this.calculateAverageRating(bookReviews);
      return this.toResponseDTO(book, averageRating);
    });  }

  async findOne(id: string): Promise<BookResponseDto> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) throw new NotFoundException('Book not found');

    const reviews = await this.reviewsService.findByBookId(id);
    const averageRating = this.calculateAverageRating(reviews);

    return this.toResponseDTO(book, averageRating);
  }

  async getReviewsByBookId(bookId: string): Promise<ReviewResponseDto[]> {
    return this.reviewsService.findByBookId(bookId);
  }

  async getDistributionRatingsByBookId(bookId: string): Promise<RatingDistribution[]> {
    return this.reviewsService.getRatingDistribution(bookId);
  }

  async update(id: string, bookDto: BookRequestDto): Promise<BookResponseDto> {
    const book = await this.findOne(id);
    const updatedBook = plainToInstance(Book, { ...book, ...bookDto });
    const savedBook = await this.bookRepository.save(updatedBook);
    return this.toResponseDTO(savedBook);
  }

  async remove(id: string): Promise<void> {
    const result = await this.bookRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Book not found');
  }

  private groupReviewsByBookId(reviews: { bookId: string; rating: number }[]) {
    return reviews.reduce((acc, review) => {
      if (!acc[review.bookId]) acc[review.bookId] = [];
      acc[review.bookId].push(review);
      return acc;
    }, {} as { [key: string]: { rating: number }[] });
  }

  private calculateAverageRating(reviews: { rating: number }[]): number {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + Number(review.rating), 0);
    return parseFloat((totalRating / reviews.length).toFixed(1));
  }

  private toResponseDTO(book: Book, rating?: number): BookResponseDto {
    const { id, title, author, publicationDate, coverUrl } = book;
    return { id, title, author, publicationDate, coverUrl, rating };
  }
}

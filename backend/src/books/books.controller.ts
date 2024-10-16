// books.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
  Put,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { BookRequestDto, BookResponseDto } from './dto/book.dto';
import { ReviewResponseDto } from 'src/reviews/dto/review.dto';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/entities/user-role.enum';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @Roles(UserRole.ADMIN)
  create(@Body() bookDto: BookRequestDto): Promise<BookResponseDto> {
    return this.booksService.create(bookDto);
  }

  @Get()
  findAll(): Promise<BookResponseDto[]> {
    return this.booksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<BookResponseDto> {
    return this.booksService.findOne(id);
  }

  @Get(':id/reviews')
  getReviews(@Param('id') id: string): Promise<ReviewResponseDto[]> {
    return this.booksService.getReviewsByBookId(id);
  }

  @Get(':id/reviews/rating-distribution')
  getDistributionRatings(@Param('id') id: string): Promise<any> {
    return this.booksService.getDistributionRatingsByBookId(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() bookDto: BookRequestDto,
  ): Promise<BookResponseDto> {
    return this.booksService.update(id, bookDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string): Promise<void> {
    return this.booksService.remove(id);
  }
}

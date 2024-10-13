import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    UsePipes,
    ValidationPipe,
  } from '@nestjs/common';
  import { ReviewsService } from './reviews.service';
  import { ReviewRequestDto, ReviewResponseDto, UpdateReviewDto } from './dto/review.dto';
  
  @Controller('reviews')
  export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}
  
    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async create(@Body() reviewDto: ReviewRequestDto): Promise<ReviewResponseDto> {
      return this.reviewsService.create(reviewDto);
    }
  
    @Get()
    async findAll(): Promise<ReviewResponseDto[]> {
      return this.reviewsService.findAll();
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<ReviewResponseDto> {
      return this.reviewsService.findOne(id);
    }
  
    @Patch(':id')
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async update(
      @Param('id') id: string,
      @Body() updateDto: UpdateReviewDto,
    ): Promise<ReviewResponseDto> {
      return this.reviewsService.update(id, updateDto);
    }
  
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
      return this.reviewsService.remove(id);
    }
  }
  
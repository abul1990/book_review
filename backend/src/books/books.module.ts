import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/books.entity';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { ReviewsModule } from 'src/reviews/reviews.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Book]), 
        ReviewsModule
      ],    
    controllers: [BooksController],
    providers: [BooksService],
  })
export class BooksModule {}

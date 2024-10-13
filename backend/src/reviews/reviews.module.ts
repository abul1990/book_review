import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/reviews.entity';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { Book } from 'src/books/entities/books.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Review, Book, User]), 
      ],    
    controllers: [ReviewsController],
    providers: [ReviewsService],
  })
export class ReviewsModule {}

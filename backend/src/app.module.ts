import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppDataSource } from 'config/data-source';
import { BooksModule } from './books/books.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(AppDataSource.options),
    UsersModule,
    BooksModule,
    ReviewsModule,
    AuthModule
  ]
})
export class AppModule {}

import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from 'src/users/entities/user.entity';
import { Book } from 'src/books/entities/books.entity';
import { Review } from 'src/reviews/entities/reviews.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'book_reviews',
  entities: [User, Book, Review],
  synchronize: true, 
//   migrations: ["dist/migrations/*.js"],
  logging: true,
});

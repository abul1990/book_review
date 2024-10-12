import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from 'src/users/entities/user.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'book_reviews',
  entities: [User],
  synchronize: true, 
//   migrations: ["dist/migrations/*.js"],
  logging: true,
});

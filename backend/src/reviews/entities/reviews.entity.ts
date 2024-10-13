import { Book } from 'src/books/entities/books.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', width: 1 })
  rating: number; 
  @Column({ length: 500 })
  reviewText: string;

  @Column({ type: 'date' })
  reviewDate: Date;

  @ManyToOne(() => Book, (book) => book.reviews, { onDelete: 'CASCADE' })  
  @JoinColumn({ name: 'book_id' })  
  book: Book;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })  
  @JoinColumn({ name: 'user_id' })
  user: User;
}

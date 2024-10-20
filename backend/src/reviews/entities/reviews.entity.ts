import { Book } from 'src/books/entities/books.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';

@Entity('reviews')
@Unique(['user', 'book']) 
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 2, scale: 1 })
  rating: number; 

  @Column({ length: 500, nullable: true })
  comment: string;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => Book, (book) => book.reviews, { onDelete: 'CASCADE' })  
  @JoinColumn({ name: 'book_id' })  
  book: Book;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })  
  @JoinColumn({ name: 'user_id' })
  user: User;
}

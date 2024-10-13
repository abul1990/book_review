import { Review } from 'src/reviews/entities/reviews.entity';
import { v4 as uuidv4 } from 'uuid';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ type: 'date' })
  publicationDate: Date;

  @Column({ nullable: true })
  coverUrl: string;

  @OneToMany(() => Review, (review) => review.book)
  reviews: Review[];

//   constructor() {
//     this.id = uuidv4();
//   }
}

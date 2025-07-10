import { Book } from 'src/books/entities/book.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Borrow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Book, (book) => book.borrowHistory)
  book: Book;

  @ManyToOne(() => User, (user) => user.borrowedBooks)
  user: User;

  @CreateDateColumn()
  borrowedAt: Date;

  @Column({ nullable: true })
  returnedAt: Date;
}

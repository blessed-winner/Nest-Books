import { Borrow } from 'src/borrow/entities/borrow.entity';
import { Column, PrimaryGeneratedColumn, Entity, OneToMany } from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column()
  author: string;

  @OneToMany(() => Borrow, (borrow) => borrow.book)
  borrowHistory: Borrow[];
}

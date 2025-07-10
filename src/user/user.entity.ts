import { Borrow } from 'src/borrow/entities/borrow.entity';
import { Column, PrimaryGeneratedColumn, Entity, OneToMany } from 'typeorm';

export enum Role {
  USER = 'user',
  LIBRARIAN = 'librarian',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @OneToMany(() => Borrow, (borrow) => borrow.user)
  borrowedBooks: Borrow[];

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  resetToken?: string | null;

  @Column({ nullable: true, type: 'timestamp' })
  resetTokenExpiry?: Date | null;
}

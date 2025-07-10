import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { Borrow } from 'src/borrow/entities/borrow.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Borrow)
    private readonly borrowRepo: Repository<Borrow>,
  ) {}
  async create(createBookDto: CreateBookDto): Promise<Book> {
    const book = await this.bookRepository.create(createBookDto);
    return await this.bookRepository.save(book);
  }

  async findAll(): Promise<Book[]> {
    return await this.bookRepository.find();
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository.findOneBy({ id });
    if (!book) throw new NotFoundException(`Book with ID ${id} not found`);
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.bookRepository.preload({
      id,
      ...updateBookDto,
    });
    if (!book) throw new NotFoundException(`Book with ID ${id} not found`);
    return await this.bookRepository.save(book);
  }

  async remove(id: number) {
    const result = await this.bookRepository.delete({ id });
    if (result.affected === 0)
      throw new NotFoundException(`User with ID ${id} not found`);
    return { message: 'success' };
  }

  async getBorrowHistory(bookId: number) {
    return await this.borrowRepo.find({
      where: { book: { id: bookId } },
      relations: ['user'],
      order: { borrowedAt: 'DESC' },
    });
  }
}

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Book } from 'src/books/entities/book.entity';
import { Borrow } from './entities/borrow.entity';


@Injectable()
export class BorrowService {
   constructor(
      @InjectRepository(User) private readonly userRepo:Repository<User>,
      @InjectRepository(Book) private readonly bookRepo:Repository<Book>,
      @InjectRepository(Borrow) private readonly borrowRepo:Repository<Borrow>
   ){}
  async create(dto:BorrowBookDto):Promise<{borrow:Borrow,message:string}> {
    const user = await this.userRepo.findOneBy({id:dto.userId})
    const book = await this.bookRepo.findOneBy({id:dto.bookId})
    const borrow = this.borrowRepo.create({
      book:{id:dto.bookId},
      user:{id:dto.userId},
      borrowedAt:new Date()
    })
    const borrowed = await this.borrowRepo.save(borrow)
    return{
      borrow:borrowed,
      message:'Book successfully borrowed!!'
    }
  }

  async returnBook(borrowId:number):Promise<{borrow:Borrow,message:string}>{
    const borrow = await this.borrowRepo.findOneBy({id:borrowId})
    if(!borrow) throw new NotFoundException('No borrow found!')
    if(borrow.returnedAt) throw new NotFoundException('Book already returned!')
    borrow.returnedAt = new Date()
   const saved = await this.borrowRepo.save(borrow)
   return {borrow:saved,message:'Book returned successfully!!'}
  
  }
  
}

 
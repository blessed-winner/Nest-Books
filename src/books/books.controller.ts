import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { TypeOrmExceptionFilter } from 'src/utils/Filters/exception-filters';
import { JwtAuthGuard } from 'src/utils/Guards/jwt-auth.guard';
import { RolesGuard } from 'src/utils/Guards/roles.guard';
import { Roles } from 'src/utils/decorator/roles.decorator';
import { Role } from 'src/user/user.entity';

@UseFilters(TypeOrmExceptionFilter)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}
   
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(+id, updateBookDto);
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }
}

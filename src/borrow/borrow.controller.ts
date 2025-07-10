import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { JwtAuthGuard } from 'src/utils/Guards/jwt-auth.guard';

@Controller('borrow')
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: BorrowBookDto) {
    return this.borrowService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: BorrowBookDto) {
    return this.borrowService.returnBook(+id);
  }
}

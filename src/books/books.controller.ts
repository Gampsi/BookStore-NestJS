import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post('/AddBook/')
  async create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get()
  async getBooks() {
    return this.booksService.getBooks();
  }

  @Get(':id')
  async getBook(@Param('id', ParseIntPipe) id: number) {
    const book = await this.booksService.getBook(id);
    return book;
  }

  @Get('/CreateCSV/:id')
  async createCSV(@Param('id', ParseIntPipe) id: number) {
    const bookTitle = await this.booksService.createCSV(id);

    const test = {
      title: bookTitle,
      link: `/booksCSV/${encodeURI(bookTitle)}.csv`,
    };
    return test;
  }

  @Patch('/EditBook/:id')
  async updateBook(
    @Param('id') id: number,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.booksService.updateBook(id, updateBookDto);
  }

  @Delete('/RemoveBook/:id')
  async remove(@Param('id') id: number) {
    return this.booksService.remove(id);
  }
}

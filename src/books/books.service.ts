import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { writeFile } from 'fs';
import { Model } from 'mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book, BookDocument } from './schemas/books.schema';
import { json2csvAsync } from 'json-2-csv';
import { join } from 'path';

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const createdBook = new this.bookModel(createBookDto);
    return createdBook.save();
  }

  async getBooks(): Promise<Book[]> {
    return this.bookModel.find().exec();
  }

  //This method uses find().limit() because it returns null if there is no book found.
  //Using findOne() returns a document even if it doesn't find what we want.
  async getBook(id: number): Promise<Book> {
    const book = await this.bookModel.find({ id: id }).limit(1).exec();

    if (!book[0]) {
      throw new HttpException("Book doesn't exist", HttpStatus.NOT_FOUND);
    }

    return book[0];
  }

  async updateBook(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const updatedBook = this.bookModel
      .findOneAndUpdate({ id: id }, updateBookDto)
      .exec();

    return (await updatedBook).save();
  }

  async remove(id: number) {
    return this.bookModel.deleteOne({ id: id });
  }

  //Creates the csv, first it finds the book and if not found it throws 404,
  //Else it converts the book's info into csv format and then writes a file so it can be downloaded after.
  async createCSV(id: number): Promise<string> {
    const book = await this.bookModel.find({ id: id }).limit(1).exec();

    if (!book) {
      throw new HttpException("Book doesn't exist", HttpStatus.NOT_FOUND);
    }

    const data = [
      {
        title: book[0].title,
        description: book[0].description,
        author: book[0].author,
      },
    ];

    const csv = await json2csvAsync(data);

    writeFile(
      join(__dirname, '../..', `booksCSV/${book[0].title}.csv`),
      csv,
      (err) => {
        if (err) {
          console.error(err);
          throw new HttpException(
            "Couldn't create the csv",
            HttpStatus.NOT_FOUND,
          );
        }
      },
    );

    return book[0].title;
  }
}

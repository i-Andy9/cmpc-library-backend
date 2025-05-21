import { FileInterceptor } from '@nestjs/platform-express';

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookQueryDto } from 'src/common/dto/bookQuery.dto';
import { Parser } from 'json2csv';
import { Response } from 'express';
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Get()
  findAll(@Query() bookQueryDto: BookQueryDto) {
    return this.bookService.findAll(bookQueryDto);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.bookService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.bookService.update(id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.bookService.remove(id);
  }

  @Patch(':id/image')
  @UseInterceptors(FileInterceptor('image', { dest: './uploads' }))
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imageUrl = `/uploads/${file.filename}`;
    return this.bookService.update(id, { imageUrl });
  }

  @Get('export/csv')
  async exportCsv(@Res() res: Response) {
    const books = await this.bookService.findAll({});
    const parser = new Parser();
    const csv = parser.parse(books.books);
    res.header('Content-Type', 'text/csv');
    res.attachment('books.csv');
    return res.send(csv);
  }
}

import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { InjectModel } from '@nestjs/sequelize';
import { BookResponseDto } from './dto/book-response.dto';
import { BookQueryDto } from 'src/common/dto/bookQuery.dto';

@Injectable()
export class BookService {
  private readonly logger: Logger = new Logger(BookService.name);
  constructor(
    @InjectModel(Book)
    private readonly bookModel: typeof Book,
  ) {}
  private toBookResponse(book: Book): BookResponseDto {
    const { title, author, publisher, price, available, genre, imageUrl } =
      book;
    return { title, author, publisher, price, available, genre, imageUrl };
  }
  async create(createBookDto: CreateBookDto): Promise<BookResponseDto> {
    try {
      const newBook = await this.bookModel.create({ ...createBookDto } as any);
      return this.toBookResponse(newBook);
    } catch (error) {
      this.logger.error('Error creating book:', error.message);
      throw new InternalServerErrorException('Failed to create book');
    }
  }

  async findAll(bookQueryDto: BookQueryDto) {
    const { limit = 10, offset = 0 } = bookQueryDto;
    try {
      const where: any = {};
      if (bookQueryDto?.genre) where.genre = bookQueryDto.genre;
      if (bookQueryDto?.publisher) where.publisher = bookQueryDto.publisher;
      if (bookQueryDto?.author) where.author = bookQueryDto.author;
      if (bookQueryDto?.available !== undefined)
        where.available = bookQueryDto.available;

      const books = await this.bookModel.findAll({ where, limit, offset });
      if (!books || books.length === 0) {
        throw new NotFoundException('No books found');
      }
      const booksArray = books.map((book) => this.toBookResponse(book));
      return { books: booksArray };
    } catch (error) {
      this.logger.error('Error fetching books:', error.message);
      throw new InternalServerErrorException('Failed to fetch books');
    }
  }

  async findOne(id: string): Promise<BookResponseDto> {
    try {
      const book = await this.bookModel.findByPk(id);
      if (!book) {
        throw new NotFoundException(`Book with id ${id} not found`);
      }
      console.log(book);
      return this.toBookResponse(book);
    } catch (error) {
      this.logger.error('Error fetching book:', error.message);
      throw new InternalServerErrorException('Failed to fetch book');
    }
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    let book: Book | null;
    try {
      book = await this.bookModel.findByPk(id);
      if (!book) {
        throw new NotFoundException(`Book with id ${id} not found`);
      }
      await book.update(updateBookDto);
      await book.save();

      return this.toBookResponse(book);
    } catch (error) {
      this.logger.error('Error updating book:', error.message);
      throw new InternalServerErrorException('Failed to update book');
    }
  }

  async remove(id: string) {
    await this.bookModel.destroy({ where: { id } });
    return `This action removes a #${id} book`;
  }
}

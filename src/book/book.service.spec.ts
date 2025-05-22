import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { BookService } from './book.service';
import { Book } from './entities/book.entity';
import { BookQueryDto } from '../common/dto/bookQuery.dto';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('BookService', () => {
  let service: BookService;
  let bookModel: any;

  beforeEach(async () => {
    bookModel = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
      destroy: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        { provide: getModelToken(Book), useValue: bookModel },
      ],
    }).compile();
    service = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a book', async () => {
    const dto = {
      title: 'A',
      author: 'B',
      publisher: 'C',
      price: 1,
      available: true,
      genre: 'G',
      imageUrl: 'img',
    };
    bookModel.create.mockResolvedValue(dto);
    const result = await service.create(dto as any);
    expect(result).toEqual(dto);
  });

  it('should return books array on findAll', async () => {
    const books = [
      {
        title: 'A',
        author: 'B',
        publisher: 'C',
        price: 1,
        available: true,
        genre: 'G',
        imageUrl: 'img',
      },
    ];
    bookModel.findAll.mockResolvedValue(books);
    const result = await service.findAll({} as BookQueryDto);
    expect(result).toEqual({ books });
  });

  it('should return empty array if no books', async () => {
    bookModel.findAll.mockResolvedValue([]);
    const result = await service.findAll({} as BookQueryDto);
    expect(result).toEqual({ books: [] });
  });

  it('should return a book on findOne', async () => {
    const book = {
      title: 'A',
      author: 'B',
      publisher: 'C',
      price: 1,
      available: true,
      genre: 'G',
      imageUrl: 'img',
    };
    bookModel.findByPk.mockResolvedValue(book);
    const result = await service.findOne('1');
    expect(result).toEqual({
      title: 'A',
      author: 'B',
      publisher: 'C',
      price: 1,
      available: true,
      genre: 'G',
      imageUrl: 'img',
    });
  });

  it('should throw NotFoundException if book not found on findOne', async () => {
    bookModel.findByPk.mockResolvedValue(null);
    await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
  });

  it('should update a book', async () => {
    const book = {
      update: jest.fn(),
      save: jest.fn(),
      title: 'A',
      author: 'B',
      publisher: 'C',
      price: 1,
      available: true,
      genre: 'G',
      imageUrl: 'img',
    };
    bookModel.findByPk.mockResolvedValue(book);
    book.update.mockResolvedValue(book);
    book.save.mockResolvedValue(book);
    const result = await service.update('1', { title: 'Z' } as any);
    expect(result).toEqual({
      title: 'A',
      author: 'B',
      publisher: 'C',
      price: 1,
      available: true,
      genre: 'G',
      imageUrl: 'img',
    });
  });

  it('should throw NotFoundException if book not found on update', async () => {
    bookModel.findByPk.mockResolvedValue(null);
    await expect(service.update('1', { title: 'Z' } as any)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should remove a book', async () => {
    bookModel.destroy.mockResolvedValue(1);
    const result = await service.remove('1');
    expect(result).toBe('This action removes a #1 book');
  });
});

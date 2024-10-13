import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/books.entity';
import { BookRequestDto, BookResponseDto } from './dto/book.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async create(bookDto: BookRequestDto): Promise<BookResponseDto> {
    const newBook = plainToInstance(Book, bookDto);
    const savedBook = await this.bookRepository.save(newBook);
    return this.toResponseDTO(savedBook);
  }

  async findAll(): Promise<BookResponseDto[]> {
    const books = await this.bookRepository.find();
    return books.map(this.toResponseDTO);
  }

  async findOne(id: string): Promise<BookResponseDto> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) throw new NotFoundException('Book not found');
    return this.toResponseDTO(book);
  }

  async update(id: string, bookDto: BookRequestDto): Promise<BookResponseDto> {
    const book = await this.findOne(id);
    const updatedBook = plainToInstance(Book, { ...book, ...bookDto });
    const savedBook = await this.bookRepository.save(updatedBook);
    return this.toResponseDTO(savedBook);
  }

  async remove(id: string): Promise<void> {
    const result = await this.bookRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Book not found');
  }

  private toResponseDTO(book: Book): BookResponseDto {
    const { id, title, author, publicationDate, coverUrl } = book;
    return { id, title, author, publicationDate, coverUrl };
  }
}

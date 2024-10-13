// books.controller.ts
import {
    Controller, Get, Post, Patch, Delete, Param, Body, UsePipes, ValidationPipe,
  } from '@nestjs/common';
  import { BooksService } from './books.service';
  import { BookRequestDto, BookResponseDto } from './dto/book.dto';
  
  @Controller('books')
  export class BooksController {
    constructor(private readonly booksService: BooksService) {}
  
    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    create(@Body() bookDto: BookRequestDto): Promise<BookResponseDto> {
      return this.booksService.create(bookDto);
    }
  
    @Get()
    findAll(): Promise<BookResponseDto[]> {
      return this.booksService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string): Promise<BookResponseDto> {
      return this.booksService.findOne(id);
    }
  
    @Patch(':id')
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    update(
      @Param('id') id: string,
      @Body() bookDto: BookRequestDto,
    ): Promise<BookResponseDto> {
      return this.booksService.update(id, bookDto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
      return this.booksService.remove(id);
    }
  }
  
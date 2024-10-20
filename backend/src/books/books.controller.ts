// books.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
  Put,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { BookRequestDto, BookResponseDto } from './dto/book.dto';
import { ReviewResponseDto } from 'src/reviews/dto/review.dto';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/entities/user-role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads'),
        filename: (req, file, callback) => {
          const bookId = uuidv4();
          const uniqueName = `${bookId}${extname(file.originalname)}`;
          req.body = {...req.body, id: bookId};
          callback(null, uniqueName);
        },
      }),
    }),
  )
  create(
    @Body() bookDto: BookRequestDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(image\/jpg|image\/jpeg|image\/png)$/,
        })
        .addMaxSizeValidator({
          maxSize: 262144,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    file?: Express.Multer.File,
  ): Promise<BookResponseDto> {
    const coverUrl = file ? `/uploads/${file.filename}` : undefined;
    return this.booksService.create({ ...bookDto, coverUrl });
  }

  @Get()
  findAll(): Promise<BookResponseDto[]> {
    return this.booksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<BookResponseDto> {
    return this.booksService.findOne(id);
  }

  @Get(':id/reviews')
  getReviews(@Param('id') id: string): Promise<ReviewResponseDto[]> {
    return this.booksService.getReviewsByBookId(id);
  }

  @Get(':id/reviews/rating-distribution')
  getDistributionRatings(@Param('id') id: string): Promise<any> {
    return this.booksService.getDistributionRatingsByBookId(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads'),
        filename: (req, file, callback) => {
          const uniqueName = `${req.params.id}${extname(file.originalname)}`;
          callback(null, uniqueName);
        },
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() bookDto: BookRequestDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(image\/jpg|image\/jpeg|image\/png)$/,
        })
        .addMaxSizeValidator({
          maxSize: 262144,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    file?: Express.Multer.File,
  ): Promise<BookResponseDto> {
    const coverUrl = file ? `/uploads/${file.filename}` : undefined;
    return this.booksService.update(id, { ...bookDto, coverUrl });
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string): Promise<void> {
    return this.booksService.remove(id);
  }
}

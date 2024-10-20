import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseInterceptors,
  HttpStatus,
  ParseFilePipeBuilder,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  UserRequestDTO,
  UserResponseDTO,
  ModifyUserDTO,
  LoginDTO,
} from './dto/user.dto';
import { ReviewResponseDto } from 'src/reviews/dto/review.dto';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from './entities/user-role.enum';
import { Public } from 'src/auth/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join, extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Public()
  @UseInterceptors(
    FileInterceptor('userPic', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads', 'users'),
        filename: (req, file, callback) => {
          const userId = uuidv4();
          const uniqueName = `${userId}${extname(file.originalname)}`;
          req.body = { ...req.body, id: userId };
          callback(null, uniqueName);
        },
      }),
    }),
  )
  async create(
    @Body() userRequestDTO: UserRequestDTO,
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
  ): Promise<UserResponseDTO> {
    const coverPicUrl = file ? `/uploads/users/${file.filename}` : undefined;
    return this.usersService.create({ ...userRequestDTO, coverPicUrl });
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(): Promise<UserResponseDTO[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDTO> {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() modifyUserDTO: ModifyUserDTO,
  ): Promise<UserResponseDTO> {
    return this.usersService.update(id, modifyUserDTO);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }

  @Post('login')
  async login(@Body() loginDTO: LoginDTO): Promise<UserResponseDTO> {
    return this.usersService.login(loginDTO);
  }

  @Get(':id/reviews')
  getReviews(@Param('id') id: string): Promise<ReviewResponseDto[]> {
    return this.usersService.getReviewsByUserId(id);
  }
}

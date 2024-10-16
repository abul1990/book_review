// users.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRequestDTO, UserResponseDTO, ModifyUserDTO, LoginDTO } from './dto/user.dto';
import { ReviewResponseDto } from 'src/reviews/dto/review.dto';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from './entities/user-role.enum';
import { Public } from 'src/auth/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Public()
  async create(@Body() userRequestDTO: UserRequestDTO): Promise<UserResponseDTO> {
    return this.usersService.create(userRequestDTO);
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

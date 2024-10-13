// users.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRequestDTO, UserResponseDTO, ModifyUserDTO } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() userRequestDTO: UserRequestDTO): Promise<UserResponseDTO> {
    return this.usersService.create(userRequestDTO);
  }

  @Get()
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
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}

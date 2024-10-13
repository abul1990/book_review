import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRequestDTO, UserResponseDTO, ModifyUserDTO } from './dto/user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userRequestDTO: UserRequestDTO): Promise<UserResponseDTO> {
    const newUser = plainToInstance(User, userRequestDTO);
    const savedUser = await this.userRepository.save(newUser);
    return this.toResponseDTO(savedUser);
  }

  async findAll(): Promise<UserResponseDTO[]> {
    const users = await this.userRepository.find();
    return users.map(this.toResponseDTO);
  }

  async findOne(id: string): Promise<UserResponseDTO> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.toResponseDTO(user);
  }

  async update(id: string, modifyUserDTO: ModifyUserDTO): Promise<UserResponseDTO> {
    const user = await this.findOne(id);  // Reusing findOne for consistency.
    const updatedUser = plainToInstance(User, { ...user, ...modifyUserDTO });
    const savedUser = await this.userRepository.save(updatedUser);
    return this.toResponseDTO(savedUser);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('User not found');
  }

  private toResponseDTO(user: User): UserResponseDTO {
    const { id, name, email, role } = user;
    return { id, name, email, role };
  }
}

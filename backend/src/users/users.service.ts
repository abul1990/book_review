import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRequestDTO, UserResponseDTO, ModifyUserDTO, LoginDTO } from './dto/user.dto';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { ReviewResponseDto } from 'src/reviews/dto/review.dto';
import { ReviewsService } from 'src/reviews/reviews.service';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly reviewsService: ReviewsService,
  ) {}

  async create(userRequestDTO: UserRequestDTO): Promise<UserResponseDTO> {
    const hashedPassword = await bcrypt.hash(userRequestDTO.password, 10);

    const newUser = plainToInstance(User, {
      ...userRequestDTO,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(newUser);

    return this.toResponseDTO(savedUser);
  }

  async findAll(): Promise<UserResponseDTO[]> {
    const users = await this.usersRepository.find();
    return users.map(this.toResponseDTO);
  }

  async findOne(id: string): Promise<UserResponseDTO> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.toResponseDTO(user);
  }

  async update(id: string, modifyUserDTO: ModifyUserDTO): Promise<UserResponseDTO> {
    const user = await this.findOne(id); 
    const updatedUser = plainToInstance(User, { ...user, ...modifyUserDTO });
    const savedUser = await this.usersRepository.save(updatedUser);
    return this.toResponseDTO(savedUser);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('User not found');
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email: email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return user;
  }

  async login(loginDTO: LoginDTO): Promise<UserResponseDTO> {
    const user = await this.usersRepository.findOne({ where: { email: loginDTO.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(loginDTO.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.toResponseDTO(user);
  }

  async getReviewsByUserId(userId: string): Promise<ReviewResponseDto[]> {
    return this.reviewsService.findByUserId(userId);
  }

  private toResponseDTO(user: User): UserResponseDTO {
    const { id, name, email, role } = user;
    return { id, name, email, role };
  }
}

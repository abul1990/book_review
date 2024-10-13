import { IsEmail, IsEnum, IsNotEmpty, Length } from 'class-validator';
import { UserRole } from '../entities/user-role.enum';

export class UserRequestDTO {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @Length(6, 20)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}

export class ModifyUserDTO {
    @IsNotEmpty()
    name? : string;
    @Length(6, 20)
    password?: string;
}

export class UserResponseDTO {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  }

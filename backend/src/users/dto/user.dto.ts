import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { UserRole } from '../entities/user-role.enum';

export class UserRequestDTO {
  @IsOptional()
  @IsString()
  id: string;

  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @Length(6, 20)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsString()
  coverPicUrl?: string;
}

export class ModifyUserDTO {
  @IsNotEmpty()
  name?: string;
  @Length(6, 20)
  password?: string;
}

export class UserResponseDTO {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  coverPicUrl?: string;
}

export class LoginDTO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

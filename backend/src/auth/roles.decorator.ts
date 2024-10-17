import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/users/entities/user-role.enum';
import * as dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'secret';
export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async signIn(loginDTO: LoginDTO): Promise<any> {
    const user = await this.usersService.findUserByEmail(loginDTO.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDTO.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user) {
      return this.generateJwtToken(user);
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  private async generateJwtToken(user: any) {
    const payload = { email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role, 
      }
    };
  }
}

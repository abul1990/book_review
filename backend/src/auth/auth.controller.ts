import { Body, Controller, Post, HttpCode, HttpStatus, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from 'src/users/dto/user.dto';
import { AuthGuard } from './auth.guard';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  signIn(@Body() loginDTO: LoginDTO) {
    return this.authService.signIn(loginDTO);
  }
}
import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from 'src/users/dto/user.dto';
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

  @HttpCode(HttpStatus.OK)
  @Post('validate-token')
  @Public()
  async validateToken(@Body('token') token: string): Promise<{ isValid: boolean }> {
    return await this.authService.validateToken(token);
  }
}
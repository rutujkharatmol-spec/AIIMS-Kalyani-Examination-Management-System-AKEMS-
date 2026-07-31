import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() signInDto: any) {
    const data = await this.authService.login(signInDto.email, signInDto.password);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString()
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Body() body: any) {
    await this.authService.logout(body.userId);
    return {
      success: true,
      timestamp: new Date().toISOString()
    };
  }
}

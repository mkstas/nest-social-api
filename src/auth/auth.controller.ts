import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { RefreshTokenGuard } from 'src/auth/guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * [domen]/auth/register
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterUserDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.register(dto);

    /**
     * age: mlsecs * secs * mins * hours * days
     */
    this.setCookieWithToken(res, 'accessToken', tokens.accessToken, 1000 * 60 * 10);
    this.setCookieWithToken(res, 'refreshToken', tokens.refreshToken, 1000 * 60 * 60 * 24 * 30);

    return { success: true };
  }

  /**
   * [domen]/auth/login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginUserDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.login(dto);

    /**
     * age: mlsecs * secs * mins * hours * days
     */
    this.setCookieWithToken(res, 'accessToken', tokens.accessToken, 1000 * 60 * 10);
    this.setCookieWithToken(res, 'refreshToken', tokens.refreshToken, 1000 * 60 * 60 * 24 * 30);

    return { success: true };
  }

  /**
   * [domen]/auth/logout
   */
  @Delete('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(req.cookies.refreshToken);

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return { success: true };
  }

  /**
   * [domen]/auth/refresh
   */
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  async refreshAccessToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const accessToken = await this.authService.refreshAccessToken(req.cookies.refreshToken);

    /**
     * age: mlsecs * secs * mins * hours * days
     */
    this.setCookieWithToken(res, 'accessToken', accessToken, 1000 * 60 * 10);

    return { success: true };
  }

  private setCookieWithToken(res: Response, name: string, token: string, maxAge: number) {
    return res.cookie(name, token, {
      httpOnly: true,
      maxAge,
    });
  }

  /**
   * [domen]/auth/check
   */
  @Get('check')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async checkAuthentication() {
    return { success: true };
  }
}

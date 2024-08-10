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

/**
 * [domen]/auth
 */
@Controller('auth')
export class AuthController {
  /**
   * Inject dependencies
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * [domen]/auth/register
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterUserDto, @Res({ passthrough: true }) res: Response) {
    /**
     * Register a new user
     */
    const tokens = await this.authService.register(dto);

    /**
     * Set cookies with tokens
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
    /**
     * Login the user
     */
    const tokens = await this.authService.login(dto);

    /**
     * Set cookies with jwt tokens
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
    /**
     * Logout the user
     */
    await this.authService.logout(req.cookies.refreshToken);

    /**
     * Clear cookies with jwt tokens
     */
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
    /**
     * Refresh access token
     */
    const accessToken = await this.authService.refreshAccessToken(req.cookies.refreshToken);

    /**
     * Set cookie with access token
     * age: mlsecs * secs * mins * hours * days
     */
    this.setCookieWithToken(res, 'accessToken', accessToken, 1000 * 60 * 10);

    return { success: true };
  }

  /**
   * Set cookie with token
   * http access only
   */
  private setCookieWithToken(res: Response, name: string, token: string, maxAge: number) {
    return res.cookie(name, token, {
      httpOnly: true,
      maxAge,
    });
  }
}

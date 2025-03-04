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
import { Response } from 'express';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { JwtRequest } from './auth.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('regiser')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() dto: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<boolean> {
    const tokens = await this.authService.register(dto);
    this.setCookieWithToken(res, 'accessToken', tokens.accessToken, 60 * 10);
    this.setCookieWithToken(res, 'refreshToken', tokens.accessToken, 60 * 60 * 24 * 30);
    return true;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<boolean> {
    const tokens = await this.authService.login(dto);
    this.setCookieWithToken(res, 'accessToken', tokens.accessToken, 60 * 10);
    this.setCookieWithToken(res, 'refreshToken', tokens.accessToken, 60 * 60 * 24 * 30);
    return true;
  }

  @Delete('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async logout(
    @Req() req: JwtRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<boolean> {
    await this.authService.logout(req.cookies.refreshToken);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return true;
  }

  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  async refreshAccessToken(
    @Req() req: JwtRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<boolean> {
    const accessToken = await this.authService.refreshAccessToken(req.cookies.refreshToken);
    this.setCookieWithToken(res, 'accessToken', accessToken, 60 * 10);
    return true;
  }

  @Get('check')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async checkAuthentication(): Promise<boolean> {
    return true;
  }

  private setCookieWithToken(res: Response, name: string, token: string, maxAge: number): void {
    res.cookie(name, token, { httpOnly: true, maxAge: maxAge * 1000 });
  }
}

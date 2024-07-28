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
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenGuard } from 'src/guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterUserDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.register(dto);

    res.cookie('accessToken', tokens.accessToken, {
      maxAge: 1000 * 60 * 10, // ml, sec, min, hours, days
      httpOnly: true,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30, // ml, sec, min, hours, days
      httpOnly: true,
    });

    return { success: true };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginUserDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.login(dto);

    res.cookie('accessToken', tokens.accessToken, {
      maxAge: 1000 * 60 * 10, // ml, sec, min, hours, days
      httpOnly: true,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30, // ml, sec, min, hours, days
      httpOnly: true,
    });

    return { success: true };
  }

  @Delete('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(req.cookies.refreshToken);

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return { success: true };
  }

  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  async refreshAccessToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const accessToken = await this.authService.refreshAccessToken(req.cookies.refreshToken);

    res.cookie('accessToken', accessToken, {
      maxAge: 1000 * 60 * 10, // ml, sec, min, hours, days
      httpOnly: true,
    });

    return { success: true };
  }
}

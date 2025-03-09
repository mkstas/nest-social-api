import { Controller, Get, HttpCode, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { JwtRequest, JwtPayload } from 'src/types/jwt.types';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async findOne(@Req() req: JwtRequest) {
    const { email } = this.jwtService.decode<JwtPayload>(req.cookies.accessToken);
    const user = await this.usersService.findOne(email);
    return user;
  }
}

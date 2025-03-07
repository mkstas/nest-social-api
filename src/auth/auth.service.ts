import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload, JwtTokens } from 'src/types/jwt.types';
import { TokensService } from 'src/core/tokens/tokens.service';
import { UsersService } from 'src/core/users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
  ) {}

  async register(dto: RegisterUserDto): Promise<JwtTokens> {
    const user = await this.usersService.create(dto);
    const { accessToken, refreshToken } = await this.tokensService.generateTokens({
      email: user.email,
      sub: user.userId,
    });
    return { accessToken, refreshToken };
  }

  async login(dto: LoginUserDto): Promise<JwtTokens> {
    const user = await this.usersService.findOne(dto.email);
    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatch) throw new UnauthorizedException('Incorrect email or password');
    const { accessToken, refreshToken } = await this.tokensService.generateTokens({
      email: user.email,
      sub: user.userId,
    });
    return { accessToken, refreshToken };
  }

  async logout(refreshToken: string): Promise<void> {
    await this.tokensService.deleteRefreshToken(refreshToken);
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    const { sub, email } = this.jwtService.decode<JwtPayload>(refreshToken);
    const accessToken = await this.tokensService.generateAccessToken({ email, sub });
    return accessToken;
  }
}

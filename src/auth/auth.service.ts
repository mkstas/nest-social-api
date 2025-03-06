import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokensService } from 'src/tokens/tokens.service';
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
  ) {}

  async register(dto: RegisterUserDto): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.create({
      email: dto.email,
      password: dto.password,
      userName: dto.userName,
    });
    const { accessToken, refreshToken } = await this.tokensService.generateTokens({
      email: user.email,
      sub: user.userId,
    });
    return { accessToken, refreshToken };
  }

  async login(dto: LoginUserDto): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findOne(dto.email);
    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatch) throw new UnauthorizedException('Incorrect email or password');
    const { accessToken, refreshToken } = await this.tokensService.generateTokens({
      email: user.email,
      sub: user.userId,
    });
    return { accessToken, refreshToken };
  }

  async logout(refreshToken: string): Promise<boolean> {
    const result = await this.tokensService.deleteRefreshToken(refreshToken);
    return result;
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    const { sub, email } = this.jwtService.decode<{ sub: number; email: string }>(refreshToken);
    const accessToken = await this.tokensService.generateAccessToken({ email, sub });
    return accessToken;
  }
}

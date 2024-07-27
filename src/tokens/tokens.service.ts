import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { env } from 'process';

@Injectable()
export class TokensService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async generateAccessToken(sub: number, email: string) {
    return await this.jwtService.signAsync(
      { sub, email },
      {
        secret: env.JWT_ACCESS_SECRET,
        expiresIn: '10m',
      },
    );
  }

  async generateRefreshToken(sub: number, email: string) {
    return await this.jwtService.signAsync(
      { sub, email },
      {
        secret: env.JWT_REFRESH_SECRET,
        expiresIn: '30d',
      },
    );
  }

  async saveRefreshToken(refreshToken: string) {
    const { sub } = await this.jwtService.decode(refreshToken);

    return await this.prismaService.token.create({
      data: {
        userId: sub,
        refreshToken,
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

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
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '10m',
      },
    );
  }

  async generateRefreshToken(sub: number, email: string) {
    return await this.jwtService.signAsync(
      { sub, email },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '30d',
      },
    );
  }

  async generateTokens(sub: number, email: string) {
    const accessToken = await this.generateAccessToken(sub, email);
    const refreshToken = await this.generateRefreshToken(sub, email);

    await this.updateOrSaveRefreshToken(refreshToken);

    return { accessToken, refreshToken };
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

  async updateRefreshToken(refreshToken: string) {
    const { sub } = await this.jwtService.decode(refreshToken);

    return await this.prismaService.token.update({
      where: { userId: sub },
      data: { refreshToken },
    });
  }

  async updateOrSaveRefreshToken(refreshToken: string) {
    const { sub } = this.jwtService.decode(refreshToken);

    const token = await this.prismaService.token.findUnique({
      where: { userId: sub },
    });

    if (!token) return await this.saveRefreshToken(refreshToken);

    return await this.updateRefreshToken(refreshToken);
  }

  async deleteRefreshToken(refreshToken: string) {
    const { sub } = await this.jwtService.decode(refreshToken);

    await this.prismaService.token.delete({
      where: {
        userId: sub,
        refreshToken,
      },
    });
  }
}

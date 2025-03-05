import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { GenerateTokenDto } from './dto/generate-token.dto';

@Injectable()
export class TokensService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async generateAccessToken(dto: GenerateTokenDto): Promise<string> {
    const accessToken = await this.jwtService.signAsync(
      { sub: dto.sub, email: dto.email },
      { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '10m' },
    );
    return accessToken;
  }

  async generateRefreshToken(dto: GenerateTokenDto): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(
      { sub: dto.sub, email: dto.email },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '30d' },
    );
    return refreshToken;
  }

  async generateTokens(
    dto: GenerateTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.generateAccessToken(dto);
    const refreshToken = await this.generateRefreshToken(dto);
    await this.updateOrSaveRefreshToken(refreshToken);
    return { accessToken, refreshToken };
  }

  async updateRefreshToken(refreshToken: string): Promise<string> {
    const { sub } = this.jwtService.decode<{ sub: number }>(refreshToken);
    const token = await this.prismaService.token.update({
      where: { userId: sub },
      data: { refreshToken },
    });
    return token.refreshToken;
  }

  async saveRefreshToken(refreshToken: string): Promise<string> {
    const { sub } = this.jwtService.decode<{ sub: number }>(refreshToken);
    const token = await this.prismaService.token.create({
      data: { userId: sub, refreshToken },
    });
    return token.refreshToken;
  }

  async updateOrSaveRefreshToken(refreshToken: string): Promise<string> {
    const { sub } = this.jwtService.decode<{ sub: number }>(refreshToken);
    const previousToken = await this.prismaService.token.findUnique({
      where: { userId: sub },
    });
    if (!previousToken) return await this.saveRefreshToken(refreshToken);
    return await this.updateRefreshToken(refreshToken);
  }

  async deleteRefreshToken(refreshToken: string): Promise<boolean> {
    const { sub } = this.jwtService.decode<{ sub: number }>(refreshToken);
    await this.prismaService.token.delete({
      where: { userId: sub },
    });
    return true;
  }
}

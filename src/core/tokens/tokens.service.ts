import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayload, JwtTokens } from 'src/types/jwt.types';
import { GenerateTokenDto } from './dto/generate-token.dto';

@Injectable()
export class TokensService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async generateAccessToken(dto: GenerateTokenDto): Promise<string> {
    const accessToken = await this.jwtService.signAsync(dto, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '10m',
    });
    return accessToken;
  }

  async generateRefreshToken(dto: GenerateTokenDto): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(dto, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '30d',
    });
    return refreshToken;
  }

  async generateTokens(dto: GenerateTokenDto): Promise<JwtTokens> {
    const accessToken = await this.generateAccessToken(dto);
    const refreshToken = await this.generateRefreshToken(dto);
    await this.updateOrSaveRefreshToken(refreshToken);
    return { accessToken, refreshToken };
  }

  async updateRefreshToken(refreshToken: string): Promise<string> {
    const { sub: userId } = this.jwtService.decode<JwtPayload>(refreshToken);
    const token = await this.prismaService.token.update({
      where: { userId },
      data: { refreshToken },
    });
    return token.refreshToken;
  }

  async saveRefreshToken(refreshToken: string): Promise<string> {
    const { sub: userId } = this.jwtService.decode<JwtPayload>(refreshToken);
    const token = await this.prismaService.token.create({
      data: { userId, refreshToken },
    });
    return token.refreshToken;
  }

  async updateOrSaveRefreshToken(refreshToken: string): Promise<string> {
    const { sub: userId } = this.jwtService.decode<JwtPayload>(refreshToken);
    const previousToken = await this.prismaService.token.findUnique({
      where: { userId },
    });
    if (!previousToken) return await this.saveRefreshToken(refreshToken);
    return await this.updateRefreshToken(refreshToken);
  }

  async deleteRefreshToken(refreshToken: string): Promise<void> {
    const { sub: userId } = this.jwtService.decode<JwtPayload>(refreshToken);
    await this.prismaService.token.delete({
      where: { userId },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TokensService {
  /**
   * Inject dependencies
   */
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Generate and return access token
   */
  async generateAccessToken(sub: number, email: string) {
    return await this.jwtService.signAsync(
      { sub, email },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '10m',
      },
    );
  }

  /**
   * Generate and return refresh token
   */
  async generateRefreshToken(sub: number, email: string) {
    return await this.jwtService.signAsync(
      { sub, email },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '30d',
      },
    );
  }

  /**
   * Generate and return jwt tokens
   */
  async generateTokens(sub: number, email: string) {
    const accessToken = await this.generateAccessToken(sub, email);
    const refreshToken = await this.generateRefreshToken(sub, email);

    /**
     * Update or save refresh token into database
     */
    await this.updateOrSaveRefreshToken(refreshToken);

    return { accessToken, refreshToken };
  }

  /**
   * Save refresh token in database
   */
  async saveRefreshToken(refreshToken: string) {
    /**
     * Decode refresh token
     */
    const { sub } = await this.jwtService.decode(refreshToken);

    /**
     * Return refresh token
     */
    return await this.prismaService.token.create({
      data: {
        userId: sub,
        refreshToken,
      },
    });
  }

  /**
   * Update refresh token in database
   */
  async updateRefreshToken(refreshToken: string) {
    /**
     * Decode refresh token
     */
    const { sub } = await this.jwtService.decode(refreshToken);

    /**
     * Return refresh token
     */
    return await this.prismaService.token.update({
      where: { userId: sub },
      data: { refreshToken },
    });
  }

  /**
   * Update or save refresh token in database
   */
  async updateOrSaveRefreshToken(refreshToken: string) {
    /**
     * Decode refresh token
     */
    const { sub } = this.jwtService.decode(refreshToken);

    /**
     * Find refresh token in database
     */
    const token = await this.prismaService.token.findUnique({
      where: { userId: sub },
    });

    /**
     * Save refresh token in database if it is not exists
     * Return refresh token
     */
    if (!token) return await this.saveRefreshToken(refreshToken);

    /**
     * Update refresh token in database
     * Return refresh token
     */
    return await this.updateRefreshToken(refreshToken);
  }

  /**
   * Delete refresh token from database
   */
  async deleteRefreshToken(refreshToken: string) {
    /**
     * Decode refresh token
     */
    const { sub } = await this.jwtService.decode(refreshToken);

    await this.prismaService.token.delete({
      where: {
        userId: sub,
      },
    });
  }
}

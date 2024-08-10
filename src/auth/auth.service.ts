import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UsersService } from 'src/core/users/users.service';
import { ProfilesService } from 'src/core/profiles/profiles.service';
import { TokensService } from 'src/core/tokens/tokens.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  /**
   * Inject dependencies
   */
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly profilesService: ProfilesService,
    private readonly tokensService: TokensService,
  ) {}

  /**
   * Register a new user
   */
  async register(dto: RegisterUserDto) {
    /**
     * Create a new user
     */
    const user = await this.usersService.create({
      email: dto.email,
      password: dto.password,
    });

    /**
     * Create a new profile
     */
    await this.profilesService.create({
      userId: user.id,
      userName: dto.userName,
    });

    /**
     * Generate and return jwt tokens
     */
    return await this.tokensService.generateTokens(user.id, user.email);
  }

  /**
   * Login the user
   */
  async login(dto: LoginUserDto) {
    /**
     * Find user by email
     */
    const user = await this.usersService.findOne(dto.email);

    /**
     * Verify the password
     */
    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);

    /**
     * Check authentication
     */
    if (!user || !passwordMatch) throw new UnauthorizedException('Неверный логин или пароль');

    /**
     * Generate and return jwt tokens
     */
    return await this.tokensService.generateTokens(user.id, user.email);
  }

  /**
   * Logout the user
   */
  async logout(refreshToken: string) {
    /**
     * Delete refresh token from database
     */
    return await this.tokensService.deleteRefreshToken(refreshToken);
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken: string) {
    /**
     * Decode refresh token
     */
    const { sub, email } = await this.jwtService.decode(refreshToken);

    /**
     * Generate and return access token
     */
    return await this.tokensService.generateAccessToken(sub, email);
  }
}

import { Controller, Get, HttpCode, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ProfilesService } from './profiles.service';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';

/**
 * [domen]/profiels
 */
@Controller('profiles')
export class ProfilesController {
  /**
   * Inject dependencies
   */
  constructor(
    private readonly jwtService: JwtService,
    private readonly profilesService: ProfilesService,
  ) {}

  /**
   * [domen]/profiles
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async findOne(@Req() req: Request) {
    /**
     * Decode refresh token
     */
    const { sub } = await this.jwtService.decode(req.cookies.accessToken);

    /**
     * Find and return profile
     */
    return await this.profilesService.findOne(sub);
  }
}

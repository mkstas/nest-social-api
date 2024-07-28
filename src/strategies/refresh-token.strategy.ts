import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => req.cookies.refreshToken]),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
    });
  }

  validate(payload: { sub: number; email: string }) {
    return payload;
  }
}

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor() {
    super({
      /**
       * Verify access token from cookie
       */
      jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => req.cookies.accessToken]),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  validate(payload: { sub: number; email: string }) {
    return payload;
  }
}

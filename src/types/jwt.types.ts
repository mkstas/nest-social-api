export interface JwtTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtRequest extends Request {
  cookies: JwtTokens;
}

export interface JwtPayload {
  sub: number;
  email: string;
}

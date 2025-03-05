export interface JwtRequest extends Request {
  cookies: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface JwtPayload {
  sub: number;
  email: string;
}

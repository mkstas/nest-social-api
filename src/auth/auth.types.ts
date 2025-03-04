export interface JwtRequest extends Request {
  cookies: {
    accessToke: string;
    refreshToken: string;
  };
}

export interface JwtPayload {
  sub: number;
  email: string;
}

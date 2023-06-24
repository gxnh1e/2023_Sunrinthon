

export type JwtPayload = {
  email: string;
  id: string;
}

export type JwtPayloadWithRefreshToken = JwtPayload & { refreshToken: string };
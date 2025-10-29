import { UserRole } from '@prisma/client';

interface AccessTokenPayload {
  sub: string; // user.id (string olarak)
  email: string;
  role: UserRole; // "ADMIN" | "USER" | "SYSTEM"
  isSystem: boolean; // sistem kullanıcısı mı
  iss: string; // issuer (örn: "auth-service")
}

interface RefreshTokenPayload {
  sub: string; // user.id
  jti: string; // refresh token id
}

export type { AccessTokenPayload, RefreshTokenPayload };

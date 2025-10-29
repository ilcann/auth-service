import { User } from '@prisma/client';
import { LoginDto } from '../dto/login.dto';

export interface IAuthService {
  validateRefreshToken(
    refreshToken: string,
  ): Promise<{ user: User; jti: string }>;
  validateUser(dto: LoginDto): Promise<User>;
  generateTokens(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }>;
  revokeRefreshToken(jti: string): Promise<void>;
}

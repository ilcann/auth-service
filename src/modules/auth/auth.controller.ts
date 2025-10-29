import {
  Body,
  Controller,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { Cookies } from 'src/common/decorators/cookies.decorator';
import { refreshCookie } from './utils/auth-cookie.util';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginDto,
  ) {
    // 1️⃣ Kullanıcı doğrulama
    const user = await this.authService.validateUser(dto);

    // 2️⃣ Token üretme
    const tokens = await this.authService.generateTokens(user);

    // 3️⃣ Refresh token'ı cookie’ye set et
    refreshCookie.set(res, tokens.refreshToken, this.configService);

    // 4️⃣ Access token’ı body’de gönder
    return {
      accessToken: tokens.accessToken,
    };
  }

  @Post('refresh')
  async refresh(
    @Cookies('refreshToken') oldRefreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!oldRefreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    // 2️⃣ Token doğrula
    const { user, jti } =
      await this.authService.validateRefreshToken(oldRefreshToken);

    // 3️⃣ Eski token'ı iptal et
    await this.authService.revokeRefreshToken(jti);

    // 4️⃣ Yeni token üret
    const tokens = await this.authService.generateTokens(user);

    // 5️⃣ Yeni refresh token'ı cookie’ye set et
    refreshCookie.set(res, tokens.refreshToken, this.configService);

    // 6️⃣ Access token’ı body’de gönder
    return {
      accessToken: tokens.accessToken,
    };
  }
}

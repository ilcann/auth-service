import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { Cookies } from 'src/common/decorators/cookies.decorator';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDto } from './dto/register.dto';
import { refreshCookie } from './utils/auth-cookie.util';
import type { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
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

    // 4️⃣ UserResponseDto'ya dönüştürme
    const userResponse = plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });

    // 5️⃣ Response
    return {
      user: userResponse,
      accessToken: tokens.accessToken,
    };
  }

  @Post('register')
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: RegisterDto,
  ) {
    // 1️⃣ Kullanıcı kaydı
    const user = await this.authService.registerUser(dto);
    // 2️⃣ Token üretme
    const tokens = await this.authService.generateTokens(user);
    // 3️⃣ Refresh token'ı cookie’ye set et
    refreshCookie.set(res, tokens.refreshToken, this.configService);
    // 4️⃣ UserResponseDto'ya dönüştürme
    const userResponse = plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });

    // 5️⃣ Response
    return {
      user: userResponse,
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

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(
    @Cookies('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    // 1️⃣ Refresh token'ı doğrula
    const { jti } = await this.authService.validateRefreshToken(refreshToken);
    // 2️⃣ Token'ı iptal et
    await this.authService.revokeRefreshToken(jti);
    // 3️⃣ Cookie'den refresh token'ı sil
    refreshCookie.clear(res);

    return { message: 'Logged out successfully' };
  }

  @ApiBearerAuth('accessToken')
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getMe(@Req() req: Request) {
    const user = req.user;

    return {
      user: plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
      }),
    };
  }
}

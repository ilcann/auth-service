import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { IAuthService } from './interfaces/auth-service.interface';
import { ConfigService } from '@nestjs/config';
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from './interfaces/jwt-payload.interface';
import { PrismaService } from 'src/database/prisma/prisma.service';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User, UserStatus } from '@prisma/client';
import cryptoUtils from '../../common/utils/crypto.util';
import { uuid } from 'uuidv4';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
  ) {}

  async validateRefreshToken(
    refreshToken: string,
  ): Promise<{ user: User; jti: string }> {
    const payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(
      refreshToken,
      {
        secret: this.configService.get('jwt.refreshSecret'),
      },
    );

    const tokenInDb = await this.prisma.refreshToken.findUnique({
      where: { jti: payload.jti },
    });
    if (!tokenInDb) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isValid = await cryptoUtils.compareWithHash(
      refreshToken,
      tokenInDb.tokenHash,
    );
    if (!isValid) {
      throw new UnauthorizedException('Refresh token mismatch');
    }

    if (tokenInDb.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    const user = await this.usersService.findById(tokenInDb.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return { user, jti: tokenInDb.jti };
  }

  async validateUser(dto: LoginDto): Promise<User> {
    const { username, password } = dto;

    // 1. Kullanıcı adı ile kullanıcıyı bul
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      console.log('User not found or inactive:', username);
      throw new NotFoundException('User not found');
    }

    if (user.status !== UserStatus.ACTIVE) {
      console.log('User is not active:', username);
      throw new UnauthorizedException('User is not active');
    }

    // 2. Şifreyi doğrula
    const isPasswordValid = await cryptoUtils.compareWithHash(
      password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async generateTokens(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Access Token
    const accessTokenSignOptions: JwtSignOptions = {
      secret: this.configService.get('jwt.secret'),
      expiresIn: this.configService.get('jwt.expiresIn'),
    };
    const accessTokenPayload: AccessTokenPayload = {
      sub: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isSystem: user.isSystem,
    };
    const accessToken = await this.jwtService.signAsync(
      accessTokenPayload,
      accessTokenSignOptions,
    );

    // Refresh Token
    const jti = uuid();
    const refreshTokenPayload: RefreshTokenPayload = {
      sub: user.id,
      jti,
    };
    const refreshTokenSignOptions: JwtSignOptions = {
      secret: this.configService.get('jwt.refreshSecret'),
      expiresIn: this.configService.get('jwt.refreshExpiresIn'),
    };
    const refreshToken = await this.jwtService.signAsync(
      refreshTokenPayload,
      refreshTokenSignOptions,
    );

    // Refresh Token'ı hashleyip DB'ye kaydet
    const refreshTokenHash = await cryptoUtils.hashPlainText(refreshToken);
    const refreshTokenExpiresInMs = this.configService.get<number>(
      'jwt.refreshExpiresInMs',
    );
    const refreshTokenExpiry = new Date(Date.now() + refreshTokenExpiresInMs!);
    await this.prisma.refreshToken.create({
      data: {
        jti,
        tokenHash: refreshTokenHash,
        userId: user.id,
        expiresAt: refreshTokenExpiry,
      },
    });

    return { accessToken, refreshToken };
  }

  async revokeRefreshToken(jti: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({ where: { jti } });
  }

  async registerUser(dto: RegisterDto): Promise<User> {
    const { email, username } = dto;

    const usernameExisting = await this.usersService.findByUsername(username);
    const emailExists = await this.usersService.findByEmail(email);

    if (usernameExisting || emailExists) {
      throw new ConflictException('Username or email already exists');
    }

    const newUser = await this.usersService.createUser(dto);

    return newUser;
  }
}

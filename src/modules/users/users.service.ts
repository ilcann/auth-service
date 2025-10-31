import { Injectable } from '@nestjs/common';
import { IUsersService } from './interfaces/users-service.interface';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { User, UserRole, UserStatus } from '@prisma/client';
import { RegisterDto } from '../auth/dto/register.dto';
import cryptoUtils from 'src/common/utils/crypto.util';

@Injectable()
export class UsersService implements IUsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(userId: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { id: userId } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { username } });
  }

  async createUser(dto: RegisterDto): Promise<User> {
    const { password, ...rest } = dto;

    const passwordHash = await cryptoUtils.hashPlainText(password);

    return await this.prisma.user.create({
      data: {
        ...rest,
        passwordHash,
        status: UserStatus.ACTIVE, // Geçici olarak ACTIVE yapıldı User manegement eklendiğinde değiştirilecek
        role: UserRole.USER,
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { IUsersService } from './interfaces/users-service.interface';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { RegisterDto } from '../auth/dto/register.dto';
import cryptoUtils from 'src/common/utils/crypto.util';
import { User } from 'src/modules/auth/interfaces/user.type';
import { UserStatus } from '@prisma/client';

@Injectable()
export class UsersService implements IUsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(userId: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true, department: true },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
      include: { role: true, department: true },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { username },
      include: { role: true, department: true },
    });
  }

  async createUser(dto: RegisterDto): Promise<User> {
    const { password, ...rest } = dto;

    const passwordHash = await cryptoUtils.hashPlainText(password);

    return await this.prisma.user.create({
      data: {
        ...rest,
        passwordHash,
        status: UserStatus.ACTIVE, // Geçici olarak ACTIVE yapıldı User manegement eklendiğinde değiştirilecek
        role: {
          connect: { key: 'User' }, // Default role olarak 'User' atanıyor seed.ts'deki role key değerine göre
        },
        department: {
          connect: { key: 'GENERAL' }, // Default department olarak 'GENERAL' atanıyor seed.ts'deki department key değerine göre
        },
      },
      include: { role: true, department: true },
    });
  }
}

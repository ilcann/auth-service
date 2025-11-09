import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { User } from 'src/modules/auth/interfaces/user.type';
import { UserStatus } from '@prisma/client';

@Injectable()
export class UsersRepository {
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

  async create(data: {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    passwordHash: string;
    status: UserStatus;
    roleKey: string;
    departmentKey: string;
  }): Promise<User> {
    const { roleKey, departmentKey, ...userData } = data;

    return await this.prisma.user.create({
      data: {
        ...userData,
        role: {
          connect: { key: roleKey },
        },
        department: {
          connect: { key: departmentKey },
        },
      },
      include: { role: true, department: true },
    });
  }
}

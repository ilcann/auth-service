import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { User } from 'src/modules/auth/interfaces/user.type';
import { Prisma, UserStatus } from '@prisma/client';

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

  async findMany(
    where: Prisma.UserWhereInput,
    options: {
      skip?: number;
      take?: number;
      orderBy?: Prisma.UserOrderByWithRelationInput;
    } = {},
  ): Promise<User[]> {
    return await this.prisma.user.findMany({
      where,
      include: {
        role: true,
        department: true,
      },
      skip: options.skip,
      take: options.take,
      orderBy: options.orderBy,
    });
  }

  async count(where: Prisma.UserWhereInput): Promise<number> {
    return await this.prisma.user.count({ where });
  }
}

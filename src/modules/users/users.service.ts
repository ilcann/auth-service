import { Injectable } from '@nestjs/common';
import { IUsersService } from './interfaces/users-service.interface';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { User } from '@prisma/client';

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
}

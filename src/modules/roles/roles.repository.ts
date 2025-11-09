import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { Prisma, UserRole } from '@prisma/client';

@Injectable()
export class RolesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    where: Prisma.UserRoleWhereInput,
    options: {
      skip?: number;
      take?: number;
      orderBy?: Prisma.UserRoleOrderByWithRelationInput;
    } = {},
  ): Promise<UserRole[]> {
    return await this.prisma.userRole.findMany({
      where,
      skip: options.skip,
      take: options.take,
      orderBy: options.orderBy,
    });
  }

  async count(where: Prisma.UserRoleWhereInput): Promise<number> {
    return await this.prisma.userRole.count({ where });
  }
}

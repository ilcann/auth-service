import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { Prisma, Department } from '@prisma/client';

@Injectable()
export class DepartmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    where: Prisma.DepartmentWhereInput,
    options: {
      skip?: number;
      take?: number;
      orderBy?: Prisma.DepartmentOrderByWithRelationInput;
    } = {},
  ): Promise<Department[]> {
    return await this.prisma.department.findMany({
      where,
      skip: options.skip,
      take: options.take,
      orderBy: options.orderBy,
    });
  }

  async count(where: Prisma.DepartmentWhereInput): Promise<number> {
    return await this.prisma.department.count({ where });
  }
}

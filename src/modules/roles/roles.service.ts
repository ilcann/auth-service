import { Injectable } from '@nestjs/common';
import { RolesRepository } from './roles.repository';
import { GetRolesQueryDto } from './dto/get-roles-query.dto';
import { GetRolesResponseDto } from './dto/get-roles-response.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepository: RolesRepository) {}

  async getRoles(params: GetRolesQueryDto): Promise<GetRolesResponseDto> {
    const { search, page = 1, size = 20 } = params;

    // Ensure page and size are numbers
    const pageNum = Number(page);
    const sizeNum = Number(size);

    // Build where clause
    const where: Prisma.UserRoleWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { key: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    // Execute queries in parallel
    const [data, total] = await Promise.all([
      this.rolesRepository.findMany(where, {
        skip: (pageNum - 1) * sizeNum,
        take: sizeNum,
        orderBy: { name: 'asc' },
      }),
      this.rolesRepository.count(where),
    ]);

    return {
      data,
      total,
      page: pageNum,
      size: sizeNum,
      totalPages: Math.ceil(total / sizeNum),
    };
  }
}

import { Injectable } from '@nestjs/common';
import { DepartmentsRepository } from './departments.repository';
import { GetDepartmentsQueryDto } from './dto/get-departments-query.dto';
import { GetDepartmentsResponseDto } from './dto/get-departments-response.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DepartmentsService {
  constructor(private readonly departmentsRepository: DepartmentsRepository) {}

  async getDepartments(
    params: GetDepartmentsQueryDto,
  ): Promise<GetDepartmentsResponseDto> {
    const { search, page = 1, size = 20 } = params;

    // Ensure page and size are numbers
    const pageNum = Number(page);
    const sizeNum = Number(size);

    // Build where clause
    const where: Prisma.DepartmentWhereInput = {
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
      this.departmentsRepository.findMany(where, {
        skip: (pageNum - 1) * sizeNum,
        take: sizeNum,
        orderBy: { name: 'asc' },
      }),
      this.departmentsRepository.count(where),
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

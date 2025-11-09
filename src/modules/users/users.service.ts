import { Injectable } from '@nestjs/common';
import { IUsersService } from './interfaces/users-service.interface';
import { RegisterDto } from '../auth/dto/register.dto';
import cryptoUtils from 'src/common/utils/crypto.util';
import { User } from 'src/modules/auth/interfaces/user.type';
import { Prisma, UserStatus } from '@prisma/client';
import { UsersRepository } from './users.repository';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { GetUsersResponseDto } from './dto/get-users-response.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService implements IUsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findById(userId: string): Promise<User | null> {
    return await this.usersRepository.findById(userId);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findByEmail(email);
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.usersRepository.findByUsername(username);
  }

  async createUser(dto: RegisterDto): Promise<User> {
    const { password, ...rest } = dto;

    const passwordHash = await cryptoUtils.hashPlainText(password);

    return await this.usersRepository.create({
      ...rest,
      passwordHash,
      status: UserStatus.ACTIVE, // Geçici olarak ACTIVE yapıldı User manegement eklendiğinde değiştirilecek
      roleKey: 'admin', // Default role olarak 'admin' geçici olarak atanıyor seed.ts'deki role key değerine göre
      departmentKey: 'general', // Default department olarak 'GENERAL' atanıyor seed.ts'deki department key değerine göre
    });
  }

  async getUsers(params: GetUsersQueryDto): Promise<GetUsersResponseDto> {
    const {
      search,
      roleIds,
      departmentIds,
      statuses,
      page = 1,
      size = 10,
    } = params;

    // Ensure page and size are numbers
    const pageNum = Number(page);
    const sizeNum = Number(size);

    // Build where clause
    const where: Prisma.UserWhereInput = {
      ...(search && {
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { username: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(roleIds?.length && {
        roleId: { in: Array.isArray(roleIds) ? roleIds : [roleIds] },
      }),
      ...(departmentIds?.length && {
        departmentId: {
          in: Array.isArray(departmentIds) ? departmentIds : [departmentIds],
        },
      }),
      ...(statuses?.length && {
        status: { in: Array.isArray(statuses) ? statuses : [statuses] },
      }),
    };

    // Execute queries in parallel
    const [data, total] = await Promise.all([
      this.usersRepository.findMany(where, {
        skip: (pageNum - 1) * sizeNum,
        take: sizeNum,
        orderBy: { createdAt: 'desc' },
      }),
      this.usersRepository.count(where),
    ]);

    const users = plainToInstance(UserResponseDto, data, {
      excludeExtraneousValues: true,
    });

    return {
      data: users,
      total,
      page: pageNum,
      size: sizeNum,
      totalPages: Math.ceil(total / sizeNum),
    };
  }
}

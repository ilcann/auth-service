import { Injectable } from '@nestjs/common';
import { IUsersService } from './interfaces/users-service.interface';
import { RegisterDto } from '../auth/dto/register.dto';
import cryptoUtils from 'src/common/utils/crypto.util';
import { User } from 'src/modules/auth/interfaces/user.type';
import { UserStatus } from '@prisma/client';
import { UsersRepository } from './users.repository';

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
}

import { User } from '@prisma/client';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';

export interface IUsersService {
  findById(userId: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  createUser(dto: RegisterDto): Promise<User>;
}

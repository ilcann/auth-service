import { User } from '@prisma/client';

export interface IUsersService {
  findById(userId: string): Promise<User | null>;
}

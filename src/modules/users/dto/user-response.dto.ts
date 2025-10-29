import { Exclude, Expose } from 'class-transformer';
import { UserRole, UserStatus } from '@prisma/client';

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  isSystem: boolean;

  @Expose()
  role: UserRole;

  @Expose()
  status: UserStatus;

  @Expose()
  departmentId?: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Exclude()
  passwordHash?: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}

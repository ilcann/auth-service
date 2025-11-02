import { Exclude, Expose } from 'class-transformer';
import type { UserStatus } from '@prisma/client';

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  isSystem: boolean;

  @Expose()
  status: UserStatus;

  @Expose()
  departmentId?: number;

  @Expose()
  roleId?: number;

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

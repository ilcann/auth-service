import { Exclude, Expose, Type } from 'class-transformer';
import type { UserStatus } from '@prisma/client';
import { UserRoleDto } from './user-role.dto';
import { UserDepartmentDto } from './user-department.dto';

export class UserResponseDto {
  @Expose()
  id: string;

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
  @Type(() => UserDepartmentDto)
  department: UserDepartmentDto;

  @Expose()
  @Type(() => UserRoleDto)
  role: UserRoleDto;

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

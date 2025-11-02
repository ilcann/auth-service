import { Department, UserRole, UserStatus } from '@prisma/client';

export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;

  firstName: string;
  lastName: string;

  isSystem: boolean;

  departmentId: string;
  department: Department; // Relation

  roleId: string;
  role: UserRole; // Relation

  status: UserStatus;

  createdAt: Date;
  updatedAt: Date;
}

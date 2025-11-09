import { Expose } from 'class-transformer';

export class UserRoleDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  key: string;

  @Expose()
  description: string;

  constructor(partial: Partial<UserRoleDto>) {
    Object.assign(this, partial);
  }
}

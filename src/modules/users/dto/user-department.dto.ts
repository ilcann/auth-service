import { Expose } from 'class-transformer';

export class UserDepartmentDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  key: string;

  constructor(partial: Partial<UserDepartmentDto>) {
    Object.assign(this, partial);
  }
}

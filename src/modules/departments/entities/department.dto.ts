import { Expose } from 'class-transformer';

export class DepartmentDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  key: string;

  @Expose()
  description: string | null;

  constructor(partial: Partial<DepartmentDto>) {
    Object.assign(this, partial);
  }
}

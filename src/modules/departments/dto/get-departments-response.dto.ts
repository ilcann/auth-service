import { DepartmentDto } from '../entities/department.dto';

export class GetDepartmentsResponseDto {
  data: DepartmentDto[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

import { UserRoleDto } from '../entities/user-role.dto';

export class GetRolesResponseDto {
  data: UserRoleDto[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

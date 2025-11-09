import { UserResponseDto } from './user-response.dto';

export class GetUsersResponseDto {
  data: UserResponseDto[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

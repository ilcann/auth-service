import { Controller, Get, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { GetRolesQueryDto } from './dto/get-roles-query.dto';
import { GetRolesResponseDto } from './dto/get-roles-response.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async getRoles(
    @Query() query: GetRolesQueryDto,
  ): Promise<GetRolesResponseDto> {
    return await this.rolesService.getRoles(query);
  }
}

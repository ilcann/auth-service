import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { GetDepartmentsQueryDto } from './dto/get-departments-query.dto';
import { GetDepartmentsResponseDto } from './dto/get-departments-response.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('departments')
@UseGuards(AuthGuard('jwt'))
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  async getDepartments(
    @Query() query: GetDepartmentsQueryDto,
  ): Promise<GetDepartmentsResponseDto> {
    return await this.departmentsService.getDepartments(query);
  }
}

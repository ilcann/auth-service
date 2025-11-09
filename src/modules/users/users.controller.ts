import { Controller, Get, Query, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
import { CurrentUser, type RequestUser } from '@tssx-bilisim/praiven-contracts';
import { GetUsersResponseDto } from './dto/get-users-response.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { UserStatus } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@Req() req: Request, @CurrentUser() reqUser: RequestUser) {
    const user = await this.usersService.findById(reqUser.userId);

    return {
      user: plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
      }),
    };
  }

  @Get()
  async getUsers(
    @Query('search') search?: string,
    @Query('roleIds[]') roleIds?: string[],
    @Query('departmentIds[]') departmentIds?: string[],
    @Query('statuses[]') statuses?: UserStatus[],
    @Query('page') page?: string,
    @Query('size') size?: string,
  ): Promise<GetUsersResponseDto> {
    const queryDto: GetUsersQueryDto = {
      search,
      roleIds,
      departmentIds,
      statuses,
      page: page ? Number(page) : undefined,
      size: size ? Number(size) : undefined,
    };

    return await this.usersService.getUsers(queryDto);
  }
}

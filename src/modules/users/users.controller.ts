import { Controller, Get, Query, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
import { CurrentUser, type RequestUser } from '@tssx-bilisim/praiven-contracts';
import { GetUsersResponseDto } from './dto/get-users-response.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';

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
    @Query() query: GetUsersQueryDto,
  ): Promise<GetUsersResponseDto> {
    return await this.usersService.getUsers(query);
  }
}

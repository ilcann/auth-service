import { Controller, Get, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
import { CurrentUser, type RequestUser } from '@tssx-bilisim/praiven-contracts';

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
}

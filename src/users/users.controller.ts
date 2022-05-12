import { Body, Controller, Post } from '@nestjs/common';
import { Roles } from 'src/auth/decorator/role.decorator';
import { ROLE } from 'src/constant/StatusConstant.constant';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(ROLE.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}

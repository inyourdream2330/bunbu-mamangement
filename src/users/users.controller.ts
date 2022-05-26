import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { GetCurrentUser } from '../auth/decorator/getCurrentUser.decorator';
import { Roles } from '../auth/decorator/role.decorator';
import { ROLE } from '../constant/constant';
import { TransformInterceptor } from '../interceptor/transform.interceptor';
import { ChangePasswordDto } from './dto/changePassword-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(TransformInterceptor)
  @Roles(ROLE.ADMIN)
  create(@Body() createUserDto: UserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('/change-password')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransformInterceptor)
  updatePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @GetCurrentUser() user,
  ) {
    return this.usersService.updatePassword(user.id, changePasswordDto);
  }

  @Put(':id')
  @Roles(ROLE.ADMIN)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransformInterceptor)
  updateUser(@Param('id') id: string, @Body() userDto: UserDto) {
    return this.usersService.updateUser(+id, userDto);
  }
}

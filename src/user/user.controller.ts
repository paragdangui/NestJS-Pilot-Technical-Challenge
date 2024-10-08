import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.authService.register(createUserDto);
    return `New user created for ${newUser.email}, please login!`;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Get('confirm-email')
  async confirmEmail(@Query('token') token: string) {
    const updatedUser = await this.userService.confirmEmail(token);

    return { message: 'Email confirmed successfully', updatedUser };
  }
}

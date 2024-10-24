import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'User Registration' })
  @ApiResponse({
    status: 201,
    description: "New user created for [newUser's email], please login!",
  })
  @ApiResponse({
    status: 201,
    description: "Email [newUser's email] is already in use",
  })
  async register(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.userService.register(createUserDto);
    return `New user created for ${newUser.email}, please login!`;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update user's first name or last name" })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        first_name: {
          type: 'string',
          example: 'Jon',
        },
        last_name: {
          type: 'string',
          example: 'Doe',
        },
      },
    },
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @ApiOperation({ summary: "Enable the user's account" })
  @Get('confirm-email')
  async confirmEmail(@Query('token') token: string) {
    const updatedUser = await this.userService.confirmEmail(token);

    return { message: 'Email confirmed successfully', updatedUser };
  }
}

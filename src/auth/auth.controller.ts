import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({
    status: 201,
    description: 'Login successful',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid Credentials',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @ApiOperation({ summary: 'User Logout' })
  @ApiResponse({
    status: 201,
    description: 'Logged out successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'TokenExpiredError: jwt expired Invalid token',
  })
  async logout(@Req() req, @Res() res) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }
    try {
      const payload = this.jwtService.verify(token);
      console.log('logged out user details', payload);
      await this.authService.blacklistToken(token);
      return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      throw new UnauthorizedException(`${error} Invalid token`);
    }
  }
}

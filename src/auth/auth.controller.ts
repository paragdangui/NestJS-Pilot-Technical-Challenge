import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CookieAuthGuard } from './guards/cookie.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    return this.authService.login(loginDto, res);
  }

  @Post('refresh-token')
  @UseGuards(CookieAuthGuard)
  @ApiBearerAuth()
  async refreshAccessToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const newAccessToken =
      await this.authService.refreshAccessToken(refreshToken);

    return res.status(200).json({ accessToken: newAccessToken });
  }

  @Post('logout')
  @UseGuards(CookieAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User Logout' })
  @ApiResponse({
    status: 201,
    description: 'Logged out successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'TokenExpiredError: jwt expired Invalid token',
  })
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header not found');
    }
    // const accessToken = authHeader.split(' ')[1];

    const userId = 1;
    // const userId = req.user.id; // Assuming req.user is set via JwtAuthGuard
    return this.authService.logout(userId, res);
  }
}

import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  Patch,
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
import { RegenerateVerificationTokenDto } from './dto/regenerateVerificationToken.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Token } from './decorator/auth.decorator';
import { JwtAuthGuard } from './guards/jwt.guard';

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

  @UseGuards(JwtAuthGuard)
  @Patch('update-password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update your existing password' })
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Token() token,
  ) {
    const { newPassword } = updatePasswordDto;

    return this.authService.updatePassword(token.sub, newPassword);
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

  @Post('regenerate-verification-token')
  @ApiOperation({
    summary:
      "Regenerates verification token incase the use wasn't verified during registration",
  })
  @ApiResponse({
    status: 201,
    description: 'Verification token regenerated successfully. Check console!',
  })
  async regenerateVerificationToken(
    @Body() regenerateVerificationTokenDto: RegenerateVerificationTokenDto,
  ) {
    await this.authService.regenerateVerificationToken(
      regenerateVerificationTokenDto.email,
    );

    return 'Verification token regenerated successfully.Check console!';
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

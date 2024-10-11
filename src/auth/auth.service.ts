import {
  Injectable,
  Res,
  Response,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto, @Res() res) {
    const { email, password } = loginDto;

    // Validate user and password
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate access and refresh tokens
    const accessToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { expiresIn: '15m' }, // Access token valid for  30 seconds
    );

    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { expiresIn: '7d' }, // Refresh token valid for 7 days
    );

    // Hash the refresh token and store it in the database
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(user.id, {
      refresh_token: hashedRefreshToken,
    });

    // Set the refresh token as an HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Enable in production for HTTPS
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send the access token in the response
    return res.status(200).json({
      accessToken,
      message: 'Login successful',
    });
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      // Verify the refresh token
      const { sub: userId } = this.jwtService.verify(refreshToken);

      // Find the user and check if the refresh token matches
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user || !user.refresh_token) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Compare the refresh token with the stored hashed refresh token
      const refreshTokenMatches = await bcrypt.compare(
        refreshToken,
        user.refresh_token,
      );
      if (!refreshTokenMatches) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Issue a new access token
      const newAccessToken = this.jwtService.sign(
        { email: user.email, sub: user.id },
        { expiresIn: '15m' }, // New access token valid for 15 minutes
      );

      return newAccessToken;
    } catch (error) {
      throw new UnauthorizedException(
        'Invalid or expired refresh token' + error,
      );
    }
  }

  async logout(userId: number, @Response() res) {
    // Clear refresh token in the database
    await this.userRepository.update(userId, { refresh_token: null });

    // Clear the refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // nsure it's only secure in production
      sameSite: 'strict',
    });

    return res.status(200).json({ message: 'Logged out successfully' });
  }

  async validateRefreshToken(token: string) {
    try {
      // Decode and verify the token using JwtService
      const payload = this.jwtService.verify(token);
      console.log('payload', payload);

      return { userId: payload.sub, email: payload.email };
    } catch (error) {
      throw new UnauthorizedException(
        'Invalid or expired refresh token:' + error,
      );
    }
  }
}

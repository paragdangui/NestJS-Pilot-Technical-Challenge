import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Res,
  Response,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UserStatus } from 'src/user/enum/user-status.enum';

@Injectable()
export class AuthService {
  private readonly MAX_FAILED_ATTEMPTS = 5; //number of failed attempts before locking the account
  private readonly LOCK_TIME = 60 * 5; // 5 minutes in seconds
  private readonly PASSWORD_EXPIRATION_DAYS = 90; // Password expires after 90 days
  private readonly PASSWORD_HISTORY_LIMIT = 5;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto, @Res() res) {
    const { email, password } = loginDto;

    // Fetch user by email
    const user = await this.userRepository.findOne({ where: { email } });

    // Ensure user exists before checking properties
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is locked due to too many failed attempts
    if (user.lockUntil && user.lockUntil.getTime() > new Date().getTime()) {
      const timeLeft = (user.lockUntil.getTime() - new Date().getTime()) / 1000;

      throw new BadRequestException(
        `Account is locked. Try again in ${Math.ceil(timeLeft)} seconds`,
      );
    }

    const passwordAge =
      (new Date().getTime() - new Date(user.passwordLastChangedAt).getTime()) /
      (1000 * 60 * 60 * 24); // Age in days

    if (passwordAge > this.PASSWORD_EXPIRATION_DAYS) {
      user.passwordExpired = true;
      await this.userRepository.save(user);
      throw new UnauthorizedException(
        'Password has expired. Please update your password.',
      );
    }

    // If user doesn't exist or wrong password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      if (user) await this.handleFailedAttempt(user); // Increment failed attempts if the user exists
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if the user is verified
    if (user.user_status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException(
        'User not verified, please verify the account first and login',
      );
    }

    // Reset failed attempts and lock status on successful login
    user.failedAttempts = 0;
    user.lockUntil = null;
    await this.userRepository.save(user);

    // Generate access and refresh tokens
    const accessToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { expiresIn: '15m' },
    );

    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { expiresIn: '7d' },
    );

    // Hash the refresh token and store it in the database
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(user.id, {
      refresh_token: hashedRefreshToken,
    });

    // Set the refresh token as an HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send the access token in the response
    return res.status(200).json({
      accessToken,
      message: 'Login successful',
    });
  }

  async updatePassword(userId: number, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    // Check if the new password matches any of the previous ones
    if (user.passwordHistory) {
      for (const oldPasswordHash of user.passwordHistory) {
        const isPasswordUsed = await bcrypt.compare(
          newPassword,
          oldPasswordHash,
        );
        if (isPasswordUsed) {
          throw new BadRequestException(
            'You cannot reuse a previously used password.',
          );
        }
      }
    }

    // Hash the new password and update it
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.passwordLastChangedAt = new Date();
    user.passwordExpired = false;

    if (!user.passwordHistory) {
      user.passwordHistory = [];
    }
    user.passwordHistory.push(hashedPassword);

    // Limit the password history to the last X passwords (e.g., 5)
    if (user.passwordHistory.length > this.PASSWORD_HISTORY_LIMIT) {
      user.passwordHistory.shift(); // Remove the oldest password hash
    }

    return this.userRepository.save(user);
  }

  // Handle failed login attempts and lock the account if needed
  private async handleFailedAttempt(user: User) {
    user.failedAttempts = (user.failedAttempts || 0) + 1;

    // Lock the account if failed attempts exceed the maximum
    if (user.failedAttempts >= this.MAX_FAILED_ATTEMPTS) {
      user.lockUntil = new Date(Date.now() + this.LOCK_TIME * 1000); // Lock the account for LOCK_TIME seconds
    }

    await this.userRepository.save(user); // Save the updated user data
  }

  async regenerateVerificationToken(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.verification_token = crypto.randomBytes(10).toString('hex');
    console.log(
      'localhost:3000/user/confirm-email?token=' + user.verification_token,
    );
    await this.userRepository.save(user);
    return user;
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

      return { userId: payload.sub, email: payload.email };
    } catch (error) {
      throw new UnauthorizedException(
        'Invalid or expired refresh token:' + error,
      );
    }
  }
}

import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;

    // Check if the email already exists in the database
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      // Throw an exception if the email is already taken
      throw new ConflictException(`Email ${email} is already in use`);
    }

    const generatedToken = crypto.randomBytes(10).toString('hex');

    // Hash the password before saving
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    // Create and save the new user
    const user = this.userRepository.create({
      ...createUserDto,
      token: generatedToken,
      password: hashedPassword,
    });
    console.log('localhost:3000/user/confirm-email?token=' + user.token);
    return this.userRepository.save(user);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Check if the user exists
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    };
  }

  private blacklistedTokens: string[] = [];

  async blacklistToken(token: string) {
    this.blacklistedTokens.push(token); // Add token to the blacklist
  }

  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.includes(token);
  }
}

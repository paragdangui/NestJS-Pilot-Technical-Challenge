import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserStatus } from './enum/user-status.enum';
import { CreateUserDto } from './dto/create-user.dto';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Find all users
  findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['list'] }); // include lists
  }

  // Find one user by id
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['list'], // include lists
    });
    if (!user) {
      throw new NotFoundException(`User with id #${id} not found`);
    }
    return user;
  }

  generatedVerificationToken = () => {
    const verificationToken = crypto.randomBytes(10).toString('hex');
    // Create and save the new user
    console.log('localhost:3000/user/confirm-email?token=' + verificationToken);

    return verificationToken;
  };

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;

    // Check if the email already exists in the database
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser)
      throw new ConflictException(`Email ${email} is already in use`);

    const verificationToken = this.generatedVerificationToken();

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      verification_token: verificationToken,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  // Function to confirm the email by updating user_status
  async confirmEmail(token: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { verification_token: token },
    });
    if (!user)
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);

    if (user.user_status === UserStatus.ACTIVE) {
      throw new HttpException('User already verified', HttpStatus.BAD_REQUEST);
    }
    user.user_status = UserStatus.ACTIVE; // Change status to active
    user.verification_token = null; // Reset token

    return this.userRepository.save(user);
  }
  // Update user details
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id); // find the user first

    // If a user exists, update with new data
    Object.assign(user, updateUserDto);

    return this.userRepository.save(user); // save updated user
  }

  // Update refresh token and its expiry
  async updateRefreshToken(
    id: number,
    refreshToken: string,
    expiryDate: Date,
  ): Promise<void> {
    const user = await this.findOne(id); // find the user first

    user.refresh_token = refreshToken;
    user.refresh_token_expiry = expiryDate;

    await this.userRepository.save(user); // save updated token info
  }

  // Remove a user by id
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id); // find the user first

    await this.userRepository.remove(user); // delete the user
  }

  // Deactivate a user
  async deactivateUser(id: number): Promise<User> {
    const user = await this.findOne(id);
    user.user_status = UserStatus.INACTIVE; // Set user as inactive
    return this.userRepository.save(user);
  }

  // Activate a user
  async activateUser(id: number): Promise<User> {
    const user = await this.findOne(id);
    user.user_status = UserStatus.ACTIVE; // Set user as active
    return this.userRepository.save(user);
  }
}

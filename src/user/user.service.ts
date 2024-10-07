import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserStatus } from './enum/user-status.enum';

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

  // Create a new user
  // TODO: the 'CreateUserDto' needs to be updated based on the entity
  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
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

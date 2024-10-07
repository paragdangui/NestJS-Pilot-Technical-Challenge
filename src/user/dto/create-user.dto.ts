import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' }) // Point 1: Enforce minimum length
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter',
  }) // Point 2: Uppercase
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase letter',
  }) // Point 2: Lowercase
  @Matches(/(?=.*\d)/, { message: 'Password must contain at least one number' }) // Point 2: Number
  @Matches(/(?=.*\W)/, {
    message: 'Password must contain at least one special character',
  }) // Point 2: Special character
  password: string;
}

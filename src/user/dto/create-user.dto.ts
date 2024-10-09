import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Enter your First Name',
    example: 'Jon',
  })
  @IsString()
  first_name: string;

  @ApiProperty({
    description: 'Enter your Last Name',
    example: 'Doe',
  })
  @IsString()
  last_name: string;

  @ApiProperty({
    description: 'Enter the email',
    example: 'abc@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Enter the password',
    example: 'abcde123$',
  })
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

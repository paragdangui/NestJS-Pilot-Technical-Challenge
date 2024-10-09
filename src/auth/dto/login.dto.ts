import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Enter the email',
    example: 'abc@gmail.com',
  })
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @ApiProperty({
    description: 'Enter the password',
    example: 'abcde123$',
  })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

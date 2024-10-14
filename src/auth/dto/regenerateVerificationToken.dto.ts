import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RegenerateVerificationTokenDto {
  @ApiProperty({
    description: 'Enter the email',
    example: 'abc@gmail.com',
  })
  @IsEmail({}, { message: 'Invalid email' })
  email: string;
}

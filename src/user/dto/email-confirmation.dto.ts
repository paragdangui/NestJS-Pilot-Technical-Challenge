import { IsBoolean, IsEmail, IsNotEmpty } from 'class-validator';

export class EmailConfirmationDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email must not be empty' })
  email: string;

  @IsBoolean({ message: 'Token must be a boolean value' })
  token: boolean;
}

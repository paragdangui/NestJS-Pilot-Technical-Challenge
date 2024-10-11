import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateListDto {
  @ApiProperty({
    description: 'Name of the list',
    example: 'Shopping List',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}

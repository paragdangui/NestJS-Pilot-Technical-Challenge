import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateListDto {
  @ApiProperty({
    description: 'Name of the list',
    example: 'Shopping List',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

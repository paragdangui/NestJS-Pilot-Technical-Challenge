import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateListItemDto {
  @ApiProperty({ description: 'Description of the list item' })
  @IsNotEmpty()
  @IsString()
  description: string;
}

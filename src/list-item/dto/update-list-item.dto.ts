import { PartialType } from '@nestjs/mapped-types';
import { CreateListItemDto } from './create-list-item.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateListItemDto extends PartialType(CreateListItemDto) {
  @ApiProperty({
    description: 'Updated description of the list item',
    required: false,
  })
  description?: string;
}

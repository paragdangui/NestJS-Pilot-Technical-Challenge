import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class CreateListDto {
  @ApiProperty({
    description: 'Name of the list',
    example: 'Shopping List',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}

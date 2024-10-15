import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { List } from 'src/list/entities/list.entity';

@Entity()
export class ListItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @ManyToOne(() => List, (list) => list.listItem, {
    onDelete: 'CASCADE',
  })
  list: List;
}

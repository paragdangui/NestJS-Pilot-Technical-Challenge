import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class List {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => User, (user) => user.lists) // Many lists can belong to one user
  // @JoinColumn({ name: 'user_id' }) // Defines the FK column in the database
  // user: User;

  @Column()
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => {} })
  updated_at: Date;
}

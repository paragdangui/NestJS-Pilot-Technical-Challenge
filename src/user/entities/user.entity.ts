import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserStatus } from '../enum/user-status.enum';
import { List } from 'src/list/entities/list.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: 0 })
  failedAttempts: number;

  @Column({ type: 'timestamp', nullable: true })
  lockUntil: Date;

  @Column({ type: 'tinyint', default: UserStatus.INACTIVE })
  user_status: UserStatus;

  @Column({ nullable: true })
  verification_token: string;

  @Column({ unique: true, nullable: true })
  refresh_token: string;

  @Column({ type: 'timestamp', nullable: true })
  refresh_token_expiry: Date;

  @Column('simple-array', { nullable: true }) // Stored hashed passwords in a comma-separated array
  passwordHistory: string[];

  @Column({ type: 'timestamp', nullable: true })
  passwordLastChangedAt: Date;

  @Column({ default: false })
  passwordExpired: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;

  @OneToMany(() => List, (list) => list.user_id) // Many lists can belong to one user
  list: List;
}

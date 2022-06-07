import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Overtime {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('time')
  start_at: Date;
  @Column('time')
  end_at: Date;
  @Column({ default: 0 })
  status: number;
  @Column({ type: 'date' })
  date: string;
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

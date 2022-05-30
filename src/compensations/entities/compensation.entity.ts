import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
@Entity()
export class Compensation {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column({ type: 'date' })
  date: string;
  @Column({ type: 'date' })
  for_date: string;
  @Column('time')
  start_at: Date;
  @Column('time')
  end_at: Date;
  @Column({ default: 0 })
  status: number;
}

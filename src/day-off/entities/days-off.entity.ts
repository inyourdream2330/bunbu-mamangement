import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
@Entity()
export class DayOff {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'date' })
  date: string;
  @Column({ type: 'text' })
  reasons: string;
  @Column({ default: 0 })
  status: number;
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column()
  day_off_type: number;
}

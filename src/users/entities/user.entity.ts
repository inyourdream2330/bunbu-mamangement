import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar', length: 100 })
  name: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 100 })
  password: string;
  @Column()
  gender: number;
  @Column()
  role: number;

  @Column({ type: 'nvarchar', length: 100 })
  id_card: string;
  @Column({ type: 'nvarchar', length: 200 })
  address: string;
  @Column({ type: 'date' })
  joining_date: string;
  @Column({ type: 'date' })
  dob: string;

  @Column({ length: 20, type: 'nvarchar', unique: true, default: 'B000000' })
  code: string;
  @Column()
  status: number;
  @Column({ length: 15 })
  phone: string;
  @Column()
  contract_type: number;
  @Column({ type: 'date' })
  official_date: string;
  @Column({ nullable: true, type: 'text' })
  hash_refresh_token: string;
}

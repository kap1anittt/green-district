import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Report } from '../reports/report.entity';

export enum UserRole {
  CITIZEN = 'citizen',
  INSPECTOR = 'inspector',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column({ nullable: true })
  age: number;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CITIZEN })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];
}

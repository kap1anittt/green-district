import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { GreenObject } from '../green-objects/green-object.entity';
import { ReportHistory } from './report-history.entity';

export enum ReportStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}

export enum ProblemSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  photoUrl: string;

  @Column({ type: 'text', nullable: true })
  aiAnalysis: string;

  @Column({ nullable: true })
  problemType: string;

  @Column({ type: 'enum', enum: ProblemSeverity, default: ProblemSeverity.MEDIUM })
  severity: ProblemSeverity;

  @Column({ type: 'enum', enum: ReportStatus, default: ReportStatus.NEW })
  status: ReportStatus;

  @Column({ length: 300, nullable: true })
  address: string;

  @ManyToOne(() => User, (user) => user.reports, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => GreenObject, (obj) => obj.reports, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'greenObjectId' })
  greenObject: GreenObject;

  @Column({ nullable: true })
  greenObjectId: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ReportHistory, (h) => h.report)
  history: ReportHistory[];
}

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Report } from './report.entity';

@Entity('report_history')
export class ReportHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Report, (report) => report.history, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reportId' })
  report: Report;

  @Column()
  reportId: number;

  @Column({ nullable: true })
  oldStatus: string;

  @Column()
  newStatus: string;

  @Column({ nullable: true })
  comment: string;

  @Column({ nullable: true })
  changedBy: string;

  @CreateDateColumn()
  changedAt: Date;
}

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Report } from '../reports/report.entity';

export enum GreenObjectType {
  TREE = 'tree',
  BUSH = 'bush',
  FLOWERBED = 'flowerbed',
  LAWN = 'lawn',
  PARK = 'park',
}

export enum GreenObjectStatus {
  HEALTHY = 'healthy',
  NEEDS_ATTENTION = 'needs_attention',
  CRITICAL = 'critical',
}

@Entity('green_objects')
export class GreenObject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'enum', enum: GreenObjectType })
  type: GreenObjectType;

  @Column({ length: 300 })
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;

  @Column({ type: 'enum', enum: GreenObjectStatus, default: GreenObjectStatus.HEALTHY })
  status: GreenObjectStatus;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  plantedYear: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Report, (report) => report.greenObject)
  reports: Report[];
}

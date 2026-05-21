import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from '../reports/report.entity';
import { GreenObject } from '../green-objects/green-object.entity';
import { User } from '../users/user.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Report) private reportsRepo: Repository<Report>,
    @InjectRepository(GreenObject) private objectsRepo: Repository<GreenObject>,
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}

  async getOverview() {
    const [totalReports, totalObjects, totalUsers] = await Promise.all([
      this.reportsRepo.count(),
      this.objectsRepo.count(),
      this.usersRepo.count(),
    ]);

    const byStatus = await this.reportsRepo
      .createQueryBuilder('r')
      .select('r.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('r.status')
      .getRawMany();

    const bySeverity = await this.reportsRepo
      .createQueryBuilder('r')
      .select('r.severity', 'severity')
      .addSelect('COUNT(*)', 'count')
      .groupBy('r.severity')
      .getRawMany();

    const byType = await this.reportsRepo
      .createQueryBuilder('r')
      .select('r.problemType', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('r.problemType IS NOT NULL')
      .groupBy('r.problemType')
      .orderBy('count', 'DESC')
      .limit(8)
      .getRawMany();

    return { totalReports, totalObjects, totalUsers, byStatus, bySeverity, byType };
  }
}

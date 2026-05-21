import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report, ReportStatus, ProblemSeverity } from './report.entity';
import { ReportHistory } from './report-history.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { AiService } from '../ai/ai.service';
import { User } from '../users/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private repo: Repository<Report>,
    @InjectRepository(ReportHistory) private historyRepo: Repository<ReportHistory>,
    private aiService: AiService,
  ) {}

  findAll(status?: string) {
    const where: any = status ? { status: status as ReportStatus } : {};
    return this.repo.find({
      where,
      relations: { user: true, greenObject: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const report = await this.repo.findOne({
      where: { id },
      relations: { user: true, greenObject: true, history: true },
    });
    if (!report) throw new NotFoundException('Report not found');
    return report;
  }

  findByUser(userId: number) {
    return this.repo.find({
      where: { userId },
      relations: { greenObject: true },
      order: { createdAt: 'DESC' },
    });
  }

  async create(dto: CreateReportDto, user: User, photoPath?: string) {
    let problemType: string | undefined;
    let aiAnalysis: string | undefined;
    let severity = ProblemSeverity.MEDIUM;

    if (photoPath) {
      const result = await this.aiService.analyzePhoto(photoPath);
      problemType = result.problemType;
      aiAnalysis = result.analysis;
      const severityMap: Record<string, ProblemSeverity> = {
        low: ProblemSeverity.LOW,
        medium: ProblemSeverity.MEDIUM,
        high: ProblemSeverity.HIGH,
        critical: ProblemSeverity.CRITICAL,
      };
      severity = severityMap[result.severity] || ProblemSeverity.MEDIUM;
    }

    const report = this.repo.create({
      description: dto.description,
      address: dto.address,
      greenObjectId: dto.greenObjectId,
      userId: user.id,
      photoUrl: photoPath ? `/uploads/${photoPath.split('/').pop()}` : undefined,
      aiAnalysis,
      problemType,
      severity,
    });

    const saved = await this.repo.save(report);

    await this.historyRepo.save({
      reportId: saved.id,
      newStatus: ReportStatus.NEW,
      comment: 'Заявка создана',
      changedBy: user.name,
    });

    return saved;
  }

  async updateStatus(id: number, status: ReportStatus, changedBy: string, comment?: string) {
    const report = await this.findOne(id);
    const oldStatus = report.status;
    await this.repo.update(id, { status });
    await this.historyRepo.save({ reportId: id, oldStatus, newStatus: status, comment, changedBy });
    return this.findOne(id);
  }

  async remove(id: number) {
    const report = await this.findOne(id);
    await this.repo.delete(id);
    return report;
  }
}

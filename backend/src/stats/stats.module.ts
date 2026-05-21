import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { Report } from '../reports/report.entity';
import { GreenObject } from '../green-objects/green-object.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Report, GreenObject, User])],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}

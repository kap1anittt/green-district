import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GreenObjectsModule } from './green-objects/green-objects.module';
import { ReportsModule } from './reports/reports.module';
import { AiModule } from './ai/ai.module';
import { StatsModule } from './stats/stats.module';
import { User } from './users/user.entity';
import { GreenObject } from './green-objects/green-object.entity';
import { Report } from './reports/report.entity';
import { ReportHistory } from './reports/report-history.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: +config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD') || undefined,
        database: config.get('DB_NAME'),
        entities: [User, GreenObject, Report, ReportHistory],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    UsersModule,
    GreenObjectsModule,
    ReportsModule,
    AiModule,
    StatsModule,
  ],
})
export class AppModule {}

import {
  Controller, Get, Post, Put, Delete, Param, Body, Query,
  UseGuards, Request, UseInterceptors, UploadedFile, ParseIntPipe
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';
import { ReportStatus } from './report.entity';

const storage = diskStorage({
  destination: './uploads',
  filename: (_, file, cb) => cb(null, `${Date.now()}${extname(file.originalname)}`),
});

@Controller('reports')
export class ReportsController {
  constructor(private service: ReportsService) {}

  @Get()
  findAll(@Query('status') status?: string) {
    return this.service.findAll(status);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  findMy(@Request() req) {
    return this.service.findByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('photo', { storage }))
  create(
    @Body() dto: CreateReportDto,
    @Request() req,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.service.create(dto, req.user, file?.path);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSPECTOR)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: ReportStatus,
    @Body('comment') comment: string,
    @Request() req,
  ) {
    return this.service.updateStatus(id, status, req.user.name, comment);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}

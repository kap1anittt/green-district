import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GreenObject } from './green-object.entity';
import { CreateGreenObjectDto } from './dto/create-green-object.dto';

@Injectable()
export class GreenObjectsService {
  constructor(@InjectRepository(GreenObject) private repo: Repository<GreenObject>) {}

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number) {
    const obj = await this.repo.findOne({ where: { id }, relations: { reports: true } });
    if (!obj) throw new NotFoundException('Green object not found');
    return obj;
  }

  create(dto: CreateGreenObjectDto) {
    const obj = this.repo.create(dto);
    return this.repo.save(obj);
  }

  async update(id: number, dto: Partial<CreateGreenObjectDto>) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.repo.findOne({ where: { id } });
  }

  async remove(id: number) {
    const obj = await this.findOne(id);
    await this.repo.delete(id);
    return obj;
  }
}

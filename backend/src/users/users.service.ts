import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findAll() {
    return this.repo.find({
      select: { id: true, name: true, email: true, age: true, role: true, createdAt: true, isActive: true },
    });
  }

  async findOne(id: number) {
    const user = await this.repo.findOne({
      where: { id },
      select: { id: true, name: true, email: true, age: true, role: true, createdAt: true, isActive: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, data: Partial<User>) {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.repo.delete(id);
    return user;
  }
}

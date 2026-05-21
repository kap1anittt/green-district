import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GreenObjectsService } from './green-objects.service';
import { GreenObjectsController } from './green-objects.controller';
import { GreenObject } from './green-object.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GreenObject])],
  controllers: [GreenObjectsController],
  providers: [GreenObjectsService],
  exports: [GreenObjectsService],
})
export class GreenObjectsModule {}

import { Module } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { DepartmentsRepository } from './departments.repository';
import { PrismaModule } from 'src/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [DepartmentsService, DepartmentsRepository],
  controllers: [DepartmentsController],
})
export class DepartmentsModule {}

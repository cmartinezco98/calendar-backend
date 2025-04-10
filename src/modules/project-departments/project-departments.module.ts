import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectDepartment } from './entities/project-department.entity';
import { ProjectDepartmentsController } from './project-departments.controller';
import { ProjectDepartmentsService } from './project-departments.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectDepartment])],
  controllers: [ProjectDepartmentsController],
  providers: [ProjectDepartmentsService],
})
export class ProjectDepartmentsModule { }

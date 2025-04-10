import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectDepartment } from '../project-departments/entities/project-department.entity';
import { ProjectProjectDeparment } from '../projects-project-deparments/entities/project-project-deparment.entity';
import { Project } from './entities/project.entity';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectDepartment, ProjectProjectDeparment])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule { }

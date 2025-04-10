import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectProjectDeparment } from './entities/project-project-deparment.entity';

@Module({
   imports: [TypeOrmModule.forFeature([ProjectProjectDeparment])],
})
export class ProjectsProjectDeparmentsModule { }

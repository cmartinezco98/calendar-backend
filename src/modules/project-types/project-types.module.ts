import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectType } from './entities/project-type.entity';
import { ProjectTypesController } from './project-types.controller';
import { ProjectTypesService } from './project-types.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectType])],
  controllers: [ProjectTypesController],
  providers: [ProjectTypesService],
})
export class ProjectTypesModule { }

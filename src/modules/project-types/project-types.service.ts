import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectTypeDto } from './dto/create-project-type.dto';
import { UpdateProjectTypeDto } from './dto/update-project-type.dto';
import { ProjectType } from './entities/project-type.entity';

@Injectable()
export class ProjectTypesService {
  constructor(
    @InjectRepository(ProjectType)
    private readonly projectTypesRepository: Repository<ProjectType>
  ) { }

  create(createProjectTypeDto: CreateProjectTypeDto) {
    return 'This action adds a new projectType';
  }

  async findAll(): Promise<ProjectType[]> {
    const response = await this.projectTypesRepository.find();
    if (response) return response;
    return [];
  }

  findOne(id: number) {
    return `This action returns a #${id} projectType`;
  }

  update(id: number, updateProjectTypeDto: UpdateProjectTypeDto) {
    return `This action updates a #${id} projectType`;
  }

  remove(id: number) {
    return `This action removes a #${id} projectType`;
  }
}

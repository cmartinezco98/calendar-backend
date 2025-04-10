import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectDepartmentDto } from './dto/create-project-department.dto';
import { UpdateProjectDepartmentDto } from './dto/update-project-department.dto';
import { ProjectDepartment } from './entities/project-department.entity';

@Injectable()
export class ProjectDepartmentsService {
  constructor(
    @InjectRepository(ProjectDepartment)
    private readonly projectDepartmentRepository: Repository<ProjectDepartment>
  ) { }

  create(createProjectDepartmentDto: CreateProjectDepartmentDto) {
    return 'This action adds a new projectDepartment';
  }

  async findAll(): Promise<ProjectDepartment[]> {
    const response = await this.projectDepartmentRepository.find();
    if (response) return response;
    return [];
  }

  findOne(id: number) {
    return `This action returns a #${id} projectDepartment`;
  }

  update(id: number, updateProjectDepartmentDto: UpdateProjectDepartmentDto) {
    return `This action updates a #${id} projectDepartment`;
  }

  remove(id: number) {
    return `This action removes a #${id} projectDepartment`;
  }
}

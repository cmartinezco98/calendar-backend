import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateProjectDepartmentDto } from './dto/create-project-department.dto';
import { UpdateProjectDepartmentDto } from './dto/update-project-department.dto';
import { ProjectDepartment } from './entities/project-department.entity';
import { ProjectDepartmentsService } from './project-departments.service';

@Controller('project-departments')
export class ProjectDepartmentsController {
  constructor(private readonly projectDepartmentsService: ProjectDepartmentsService) { }

  @Post()
  create(@Body() createProjectDepartmentDto: CreateProjectDepartmentDto) {
    return this.projectDepartmentsService.create(createProjectDepartmentDto);
  }

  @Get()
  findAll(): Promise<ProjectDepartment[]> {
    return this.projectDepartmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectDepartmentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDepartmentDto: UpdateProjectDepartmentDto) {
    return this.projectDepartmentsService.update(+id, updateProjectDepartmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectDepartmentsService.remove(+id);
  }
}

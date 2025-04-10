import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProjectDepartment } from '../project-departments/entities/project-department.entity';
import { ProjectProjectDeparment } from '../projects-project-deparments/entities/project-project-deparment.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

const relations = [
  'user',
  'client',
  'type',
  'departments',
  'departments.deparment'
];

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(ProjectDepartment)
    private projectDepartmentRepository: Repository<ProjectDepartment>,
    @InjectRepository(ProjectProjectDeparment)
    private projectProjectDeparmentRepository: Repository<ProjectProjectDeparment>
  ) { }

  async create(createDataProject: CreateProjectDto): Promise<Project> {
    try {
      const project: Project = this.projectRepository.create({
        n_name: createDataProject.n_name,
        n_description: createDataProject.n_description,
        fk_user: createDataProject.fk_user,
        fk_client: createDataProject.fk_client,
        i_closed: createDataProject.i_closed,
        fk_type: createDataProject.fk_type,
        n_estimated_sale: createDataProject.n_estimated_sale,
        n_execution: createDataProject.n_execution
      });

      if (createDataProject.departments && createDataProject.departments.length === 0) throw new HttpException(`No se encontraron departamentos`, HttpStatus.NOT_FOUND);

      const deparments = await this.projectDepartmentRepository.findBy({ k_department: In(createDataProject.departments) });
      if (deparments.length == 0) throw new HttpException(`No se encontraron departamentos`, HttpStatus.NOT_FOUND);

      const resProjectCreate: Project = await this.projectRepository.save(project);

      const projectDepartments: ProjectProjectDeparment[] = [];
      deparments.forEach((department) => {
        const projectDepartment: ProjectProjectDeparment = new ProjectProjectDeparment();
        projectDepartment.fk_project = resProjectCreate.k_project;
        projectDepartment.fk_project_deparment = department.k_department;
        projectDepartments.push(projectDepartment);
      });

      await this.projectProjectDeparmentRepository.save(projectDepartments);

      return resProjectCreate;
    } catch (err) {
      throw new HttpException(`${err.sqlMessage}, Error al crear proyecto`, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<Project[]> {
    const resProjects = await this.projectRepository.find({ relations, order: { f_created_at: 'DESC' } });
    return resProjects;
  }

  async findAllOpen(): Promise<Project[]> {
    const resProjects = await this.projectRepository.find({ order: { n_name: 'ASC' }, where: { i_closed: 0 } });

    if (resProjects) return resProjects;
    throw new NotFoundException(`No se encuentron usuarios.`);
  }

  async findOne(k_project: number): Promise<Project> {
    const resProject = await this.projectRepository.findOne({ where: { k_project }, relations });
    if (!resProject) throw new HttpException(`No se encuentra proyecto con el ID ${k_project}`, HttpStatus.NOT_FOUND);
    return resProject;
  }

  async update(k_project: number, updateDataproject: UpdateProjectDto): Promise<Project> {
    try {
      const project: Project = await this.findOne(k_project);

      const updateProject: Partial<Project> = {
        n_name: updateDataproject.n_name ?? project.n_name,
        n_description: updateDataproject.n_description ?? project.n_description,
        fk_user: updateDataproject.fk_user ?? project.fk_user,
        fk_client: updateDataproject.fk_client ?? project.fk_client,
        i_closed: updateDataproject.i_closed ?? project.i_closed,
        fk_type: updateDataproject.fk_type ?? project.fk_type,
        n_estimated_sale: updateDataproject.n_estimated_sale ?? project.n_estimated_sale,
        n_execution: updateDataproject.n_execution ?? project.n_execution
      };

      await this.projectRepository.update(k_project, updateProject);

      if (updateDataproject.departments) {
        const deparments = await this.projectDepartmentRepository.findBy({ k_department: In(updateDataproject.departments) });
        if (deparments.length == 0) throw new HttpException(`No se encontraron departamentos`, HttpStatus.NOT_FOUND);

        await this.projectProjectDeparmentRepository.delete({ fk_project: k_project });

        const projectDepartments: ProjectProjectDeparment[] = [];
        deparments.forEach((department) => {
          const projectDepartment: ProjectProjectDeparment = new ProjectProjectDeparment();
          projectDepartment.fk_project = k_project;
          projectDepartment.fk_project_deparment = department.k_department;
          projectDepartments.push(projectDepartment);
        });

        await this.projectProjectDeparmentRepository.save(projectDepartments);
      }

      return this.projectRepository.findOne({ where: { k_project } });
    } catch (err) {
      throw new HttpException(`${err.sqlMessage}, Error al actualizar proyecto`, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(k_project: number) {
    if (isNaN(k_project)) throw new HttpException(`Key no valida, Error al borrar proyecto`, HttpStatus.BAD_REQUEST);
    await this.findOne(k_project);
    try {
      const res = {
        message: "Eliminado con exito",
        status: true
      };
      const resDelete = await this.projectRepository.delete(k_project);
      if (resDelete.affected == 0) {
        res.message = "No fue posible eliminar"
        res.status = false;
      }
      return res;
    } catch (err) {
      throw new HttpException(`${err.sqlMessage}, Error al borrar proyecto`, HttpStatus.BAD_REQUEST);
    }
  }
}

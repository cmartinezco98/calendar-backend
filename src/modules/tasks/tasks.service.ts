import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository, UpdateResult } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

const relations = [
  'userCreator',
  'userResponsible',
  'taskStatus',
  'project'
];

const relationsExport = [
  'userCreator',
  'userResponsible',
  'taskStatus',
  'project',
  'project.type',
  'project.departments',
  'project.departments.deparment',
  'project.client'
];

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>
  ) { }

  async create(createDataTask: CreateTaskDto): Promise<Task> {
    try {
      createDataTask.fk_user_responsible = createDataTask.fk_user_creator;
      return await this.taskRepository.save(createDataTask);
    } catch (err) {
      throw new HttpException(`${err.sqlMessage}, Error al crear tarea`, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<Task[]> {
    const resTasks = await this.taskRepository.find({ relations });
    return resTasks;
  }

  async findAllByUserResponsible(fk_user_responsible: number): Promise<Task[]> {
    const resTasks = await this.taskRepository.find({
      where: { fk_user_responsible },
      relations
    });
    return resTasks;
  }

  async findAllByProject(fk_project: number): Promise<Task[]> {
    const resTasks = await this.taskRepository.find({
      where: { fk_project },
      relations
    });
    return resTasks;
  }

  /**
   * Get taks by project order by fk_project asc
   * @returns Promise<Task[]>
   */
  async findAllOrderProject(date: { date_start: Date, date_finish: Date }): Promise<Task[]> {
    if (date.date_start && date.date_finish) {
      let dateStart = new Date(date.date_start);
      let dateFinish = new Date(date.date_finish);

      dateStart.setUTCHours(0, 0, 0, 0);
      dateFinish.setUTCHours(23, 59, 59, 999);

      return await this.taskRepository.find({
        relations: relationsExport, order: { fk_project: 'ASC' }, where: {
          f_start: Between(dateStart.toISOString(), dateFinish.toISOString()),
          f_end: Between(dateStart.toISOString(), dateFinish.toISOString()),
        }
      });
    } else if (date.date_start) {
      let dateStart = new Date(date.date_start);
      let dateFinish = new Date(date.date_start);

      dateStart.setUTCHours(0, 0, 0, 0);
      dateFinish.setUTCHours(23, 59, 59, 999);
      return await this.taskRepository.find({
        relations: relationsExport, order: { fk_project: 'ASC' }, where: {
          f_start: Between(dateStart.toISOString(), dateFinish.toISOString()),
          f_end: Between(dateStart.toISOString(), dateFinish.toISOString()),
        }
      });
    } else {
      return await this.taskRepository.find({
        relations: relationsExport, order: { fk_project: 'ASC' }
      });
    }
  }

  async findOne(k_task: number): Promise<Task> {
    const resTask = await this.taskRepository.findOne({ where: { k_task }, relations });
    if (!resTask) throw new HttpException(`No se encuentra tarea con el ID ${k_task}`, HttpStatus.NOT_FOUND);
    return resTask;
  }

  async update(k_task: number, updateDataTask: UpdateTaskDto): Promise<UpdateResult> {
    await this.findOne(k_task);
    try {
      const resTaskUpdate = await this.taskRepository.update(k_task, updateDataTask);
      return resTaskUpdate;
    } catch (err) {
      throw new HttpException(`${err.sqlMessage}, Error al actualizar tarea`, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(k_task: number) {
    if (isNaN(k_task)) throw new HttpException(`Key no valida, Error al borrar tarea`, HttpStatus.BAD_REQUEST);
    await this.findOne(k_task);
    try {
      const res = {
        message: "Eliminado con exito",
        status: true
      };
      const resDelete = await this.taskRepository.delete(k_task);
      if (resDelete.affected == 0) {
        res.message = "No fue posible eliminar"
        res.status = false;
      }
      return res;
    } catch (err) {
      throw new HttpException(`${err.sqlMessage}, Error al borrar tarea`, HttpStatus.BAD_REQUEST);
    }
  }
}

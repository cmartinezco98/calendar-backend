import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Post()
  create(@Body() createDataTask: CreateTaskDto) {
    return this.tasksService.create(createDataTask);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get('user/:idUser')
  findAllByUserResponsible(@Param('idUser') idUser: number) {
    return this.tasksService.findAllByUserResponsible(idUser);
  }

  @Get('project/:idProject')
  findAllByProject(@Param('idProject') idProject: number) {
    return this.tasksService.findAllByProject(idProject)
  }

  @Get('projects')
  findAllOrderProject(): Promise<Task[]> {
    return this.tasksService.findAllOrderProject();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateDataTask: UpdateTaskDto) {
    return this.tasksService.update(id, updateDataTask);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.tasksService.remove(id);
  }
}

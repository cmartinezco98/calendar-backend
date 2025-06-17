import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ClientsModule } from './modules/clients/clients.module';
import { MailModule } from './modules/mailer/mail.module';
import { ProjectDepartmentsModule } from './modules/project-departments/project-departments.module';
import { ProjectTypesModule } from './modules/project-types/project-types.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { RolesModule } from './modules/roles/roles.module';
import { TaskStatusModule } from './modules/task_status/task_status.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { UsersModule } from './modules/users/users.module';
import { ProjectsProjectDeparmentsModule } from './modules/projects-project-deparments/projects-project-deparments.module';

@Module({
  imports: [AuthModule, UsersModule, TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    username: 'root',
    password: 'mysql',
    database: 'calendar',
    multipleStatements: true,
    entities: [],
    autoLoadEntities: true,
    timezone: 'America/Bogota'
  }), ClientsModule, ProjectsModule, RolesModule, TaskStatusModule, TasksModule, MailModule, ProjectDepartmentsModule, ProjectTypesModule, ProjectsProjectDeparmentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

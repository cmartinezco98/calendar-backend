import { ProjectDepartment } from "src/modules/project-departments/entities/project-department.entity";
import { Project } from "src/modules/projects/entities/project.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity('project_project_deparment')
export class ProjectProjectDeparment {

   @PrimaryColumn()
   pk_id: number;

   @Column({ select: false })
   fk_project: number;

   @Column({ select: false })
   fk_project_deparment: number;

   @Column()
   f_created_at: string;

   @Column({ nullable: true })
   f_updated_at: string;

   @ManyToOne(() => Project, (project) => project.departments)
   @JoinColumn({ name: 'fk_project', referencedColumnName: 'k_project' })
   project: Project;

   @ManyToOne(() => ProjectDepartment, (deparment) => deparment.projects)
   @JoinColumn({ name: 'fk_project_deparment', referencedColumnName: 'k_department' })
   deparment: ProjectDepartment;
}

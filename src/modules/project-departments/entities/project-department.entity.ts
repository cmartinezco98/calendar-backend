import { ProjectProjectDeparment } from "src/modules/projects-project-deparments/entities/project-project-deparment.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity('project_departments')
export class ProjectDepartment {

   @PrimaryColumn()
   k_department: number;

   @Column()
   n_name: string;

   @Column()
   i_active: boolean;

   @Column()
   f_created_at: string;

   @Column()
   f_updated_at: string;

   @OneToMany(() => ProjectProjectDeparment, (project) => project.deparment)
   projects: ProjectProjectDeparment[];
}

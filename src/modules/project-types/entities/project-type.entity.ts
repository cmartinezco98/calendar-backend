import { Project } from "src/modules/projects/entities/project.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity('project_types')
export class ProjectType {

   @PrimaryColumn()
   pk_type: number;

   @Column()
   n_name: string;

   @Column()
   i_active: boolean;

   @Column()
   f_created_at: string;

   @Column({ nullable: true })
   f_updated_at: string;

   @OneToMany(() => Project, (project) => project.type)
   projects: Project[];
}

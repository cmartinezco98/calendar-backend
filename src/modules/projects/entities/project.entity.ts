import { Client } from "src/modules/clients/entities/client.entity";
import { ProjectType } from "src/modules/project-types/entities/project-type.entity";
import { ProjectProjectDeparment } from "src/modules/projects-project-deparments/entities/project-project-deparment.entity";
import { Task } from "src/modules/tasks/entities/task.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn()
    k_project: number;
    @Column()
    n_name: string;
    @Column({ nullable: true })
    n_description: string;
    @Column({ nullable: true })
    n_estimated_sale: string;
    @Column({ nullable: true })
    n_execution: string;
    @Column()
    i_closed: number;
    @Column({ select: false })
    fk_user: number;
    @Column({ select: false })
    fk_client: number;
    @Column({ select: false, nullable: true })
    fk_type: number;
    @Column()
    f_created_at: string;
    @Column()
    f_updated_at: string;

    //Relaciones
    @ManyToOne(() => User, (user) => user.project)
    @JoinColumn({ name: 'fk_user', referencedColumnName: 'k_user' })
    user: User;

    @ManyToOne(() => Client, (client) => client.project)
    @JoinColumn({ name: 'fk_client', referencedColumnName: 'k_client' })
    client: Client;

    @ManyToOne(() => ProjectType, (type) => type.projects)
    @JoinColumn({ name: 'fk_type', referencedColumnName: 'pk_type' })
    type: ProjectType;

    @OneToMany((Type) => Task, (task) => task.project)
    tasks: Task[];

    @OneToMany(() => ProjectProjectDeparment, (departments) => departments.project)
    departments: ProjectProjectDeparment[];
}

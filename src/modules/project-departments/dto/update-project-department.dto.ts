import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDepartmentDto } from './create-project-department.dto';

export class UpdateProjectDepartmentDto extends PartialType(CreateProjectDepartmentDto) {
   k_department?: number;
}

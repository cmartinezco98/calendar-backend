export class CreateProjectDto {
    n_name: string;
    n_description?: string;
    fk_user: number;
    fk_client: number;
    i_closed: number;
    fk_type: number;
    n_estimated_sale: string;
    n_execution: string;
    departments?: number[];
}

import { Department } from './department.entity';

export const DEPARTMENT_REPOSITORY = Symbol('DEPARTMENT_REPOSITORY');

export interface IDepartmentRepository {
  find(): Promise<Department[]>;
  findById(departmentId: string): Promise<Department | null>;
  save(department: Department): Promise<Department>;
}

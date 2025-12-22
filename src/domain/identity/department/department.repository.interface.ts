import { Department } from './department.entity';

export const DEPARTMENT_REPOSITORY = Symbol('DEPARTMENT_REPOSITORY');

export interface IDepartmentRepository {
  findByOrganization(organizaionId: string): Promise<Department[]>;

  findById(departmentId: string): Promise<Department | null>;

  save(department: Department): Promise<Department>;

  deleteById(departmentId: string): Promise<void>;

  deleteByIds(departmentIds: string[]): Promise<void>;
}

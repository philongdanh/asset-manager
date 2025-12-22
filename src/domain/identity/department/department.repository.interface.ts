import { Department } from './department.entity';

export const DEPARTMENT_REPOSITORY = Symbol('DEPARTMENT_REPOSITORY');

export interface IDepartmentRepository {
  // --- Query Methods ---

  findById(id: string): Promise<Department | null>;

  findByCode(organizationId: string, code: string): Promise<Department | null>;

  findAll(
    organizationId: string,
    options?: {
      limit?: number;
      offset?: number;
    },
  ): Promise<{ data: Department[]; total: number }>;

  findChildren(parentId: string): Promise<Department[]>;

  findRootDepartments(organizationId: string): Promise<Department[]>;

  // --- Validation Methods ---

  existsByCode(organizationId: string, code: string): Promise<boolean>;

  hasDependencies(id: string): Promise<boolean>;

  // --- Persistence Methods ---

  save(department: Department): Promise<Department>;

  delete(id: string): Promise<void>;
}

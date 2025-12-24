import { Department } from './department.entity';

export const DEPARTMENT_REPOSITORY = Symbol('DEPARTMENT_REPOSITORY');

export interface IDepartmentRepository {
  // --- Query Methods ---

  findById(id: string): Promise<Department | null>;

  findByName(organizationId: string, name: string): Promise<Department | null>;

  findByOrganization(organizationId: string): Promise<Department[]>;

  findAll(
    organizationId: string,
    options?: {
      parentId?: string | null;
      limit?: number;
      offset?: number;
      includeDeleted?: boolean;
      search?: string;
    },
  ): Promise<{ data: Department[]; total: number }>;

  findChildren(parentId: string): Promise<Department[]>;

  findRootDepartments(organizationId: string): Promise<Department[]>;

  findSubtree(departmentId: string): Promise<Department[]>;

  // --- Validation Methods ---

  existsById(id: string): Promise<boolean>;

  existsByName(organizationId: string, name: string): Promise<boolean>;

  hasDependencies(departmentId: string): Promise<boolean>;

  // --- Persistence Methods ---

  save(department: Department): Promise<Department>;

  update(department: Department): Promise<Department>;

  saveMany(departments: Department[]): Promise<void>;

  delete(id: string): Promise<void>; // Soft delete

  deleteMany(ids: string[]): Promise<void>; // Soft delete

  hardDelete(id: string): Promise<void>;

  hardDeleteMany(ids: string[]): Promise<void>;

  restore(id: string): Promise<void>;

  restoreMany(ids: string[]): Promise<void>;

  // --- Special Methods ---

  getDepartmentTree(organizationId: string): Promise<{
    rootDepartments: Department[];
    hierarchy: Record<string, Department[]>;
  }>;

  getDepartmentWithChildren(departmentId: string): Promise<{
    department: Department;
    children: Department[];
  } | null>;

  // --- Statistics Methods ---

  getDepartmentStats(organizationId: string): Promise<{
    totalDepartments: number;
    rootDepartments: number;
    departmentsWithChildren: number;
    departmentsWithoutParent: number;
    byLevel: Record<number, number>;
  }>;

  // --- Search Methods ---

  searchDepartments(
    organizationId: string,
    query: string,
    limit?: number,
  ): Promise<Department[]>;

  // --- Bulk Operations ---

  findByIds(ids: string[]): Promise<Department[]>;

  // --- Hierarchy Methods ---

  getDepartmentPath(departmentId: string): Promise<Department[]>;

  getDepartmentAncestors(departmentId: string): Promise<Department[]>;

  getDepartmentDescendants(departmentId: string): Promise<Department[]>;
}

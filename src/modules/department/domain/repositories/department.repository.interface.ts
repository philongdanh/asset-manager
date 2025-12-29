import { Department } from '../entities/department.entity';

export const DEPARTMENT_REPOSITORY = Symbol('DEPARTMENT_REPOSITORY');

export interface IDepartmentRepository {
    // --- Query Methods ---
    find(
        organizationId: string,
        options?: {
            parentId?: string | null;
            includeDeleted?: boolean;
        },
    ): Promise<{ data: Department[]; total: number }>;

    findByOrganization(organizationId: string): Promise<Department[]>;

    findById(id: string): Promise<Department | null>;

    // --- Validation Methods ---
    existsById(id: string): Promise<boolean>;

    // --- Persistence Methods ---
    save(department: Department): Promise<Department>;

    saveMany(departments: Department[]): Promise<void>;

    delete(ids: string[]): Promise<void>; // Soft delete

    hardDelete(ids: string[]): Promise<void>;

    restore(ids: string[]): Promise<void>;
}

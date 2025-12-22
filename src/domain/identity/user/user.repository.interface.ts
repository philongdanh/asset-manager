import { User } from './user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface IUserRepository {
  // --- Query Methods ---

  findById(id: string): Promise<User | null>;

  findByEmail(email: string): Promise<User | null>;

  findByUsername(
    organizationId: string,
    username: string,
  ): Promise<User | null>;

  findAll(
    organizationId: string,
    options?: {
      departmentId?: string;
      status?: string; // e.g., 'ACTIVE', 'INACTIVE'
      roleId?: string;
      limit?: number;
      offset?: number;
    },
  ): Promise<{ data: User[]; total: number }>;

  findByDepartment(departmentId: string): Promise<User[]>;

  // --- Validation Methods ---

  existsByEmail(email: string): Promise<boolean>;

  existsByUsername(organizationId: string, username: string): Promise<boolean>;

  // --- Persistence Methods ---

  save(user: User): Promise<User>;

  delete(id: string): Promise<void>;

  updateRoles(userId: string, roleIds: string[]): Promise<void>;
}

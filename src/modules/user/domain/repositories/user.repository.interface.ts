import { User, UserStatus } from '../entities/user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface IUserRepository {
  // --- Query Methods ---
  find(
    organizationId: string,
    options?: {
      departmentId?: string;
      status?: UserStatus;
      roleId?: string;
      search?: string;
      limit?: number;
      offset?: number;
      includeDeleted?: boolean;
    },
  ): Promise<{ data: User[]; total: number }>;
  findById(userId: string): Promise<User | null>;
  findByUsername(
    organizationId: string | null,
    username: string,
  ): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByDepartment(departmentId: string): Promise<User[]>;
  findByOrganization(organizationId: string): Promise<User[]>;
  findByRole(roleId: string): Promise<User[]>;

  // --- Validation Methods ---
  existsByEmail(email: string): Promise<boolean>;
  existsByUsername(organizationId: string, username: string): Promise<boolean>;
  existsById(userId: string): Promise<boolean>;

  // --- Persistence Methods ---
  save(user: User): Promise<User>;
  update(user: User): Promise<User>;
  saveMany(users: User[]): Promise<void>;
  delete(userId: string): Promise<void>; // Soft delete
  deleteMany(userIds: string[]): Promise<void>; // Soft delete
  hardDelete(userId: string): Promise<void>;
  hardDeleteMany(userIds: string[]): Promise<void>;
  restore(userId: string): Promise<void>;
  restoreMany(userIds: string[]): Promise<void>;

  // --- User-Role Management ---
  assignRoles(userId: string, roleIds: string[]): Promise<void>;
  removeRoles(userId: string, roleIds: string[]): Promise<void>;
  getUserRoles(userId: string): Promise<
    {
      id: string;
      name: string;
      permissionIds: string[];
    }[]
  >;
  hasRole(userId: string, roleId: string): Promise<boolean>;

  // --- User-Asset Management ---
  getAssignedAssets(userId: string): Promise<string[]>; // Returns asset IDs
  getCreatedAssets(userId: string): Promise<string[]>; // Returns asset IDs
  findUsersWithoutDepartment(organizationId: string): Promise<User[]>;
  findInactiveUsers(daysThreshold: number): Promise<User[]>;
  findInactiveUsersByOrganization(
    organizationId: string,
    daysThreshold?: number,
  ): Promise<User[]>;
  findUsersByAsset(assetId: string): Promise<User[]>; // Historical assignments
  getUserPermissions(userId: string): Promise<string[]>; // Returns permission names
}

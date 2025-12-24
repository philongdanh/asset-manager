import { User, UserStatus } from './user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface IUserRepository {
  // --- Query Methods ---

  findById(userId: string): Promise<User | null>;

  findByEmail(email: string): Promise<User | null>;

  findByUsername(
    organizationId: string,
    username: string,
  ): Promise<User | null>;

  findAll(
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

  findByDepartment(departmentId: string): Promise<User[]>;

  findByOrganization(organizationId: string): Promise<User[]>;

  findByRole(roleId: string): Promise<User[]>;

  findUsersWithRole(roleName: string, organizationId: string): Promise<User[]>;

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

  assignRole(userId: string, roleId: string): Promise<void>;

  assignRoles(userId: string, roleIds: string[]): Promise<void>;

  removeRole(userId: string, roleId: string): Promise<void>;

  removeRoles(userId: string, roleIds: string[]): Promise<void>;

  updateRoles(userId: string, roleIds: string[]): Promise<void>;

  getUserRoles(userId: string): Promise<string[]>; // Returns role IDs

  hasRole(userId: string, roleId: string): Promise<boolean>;

  // --- User-Asset Management ---

  getAssignedAssets(userId: string): Promise<string[]>; // Returns asset IDs

  getCreatedAssets(userId: string): Promise<string[]>; // Returns asset IDs

  // --- Special Methods ---

  getUsersSummary(organizationId: string): Promise<{
    totalCount: number;
    byStatus: Record<UserStatus, number>;
    byDepartment: Record<string, number>;
    withAssetsCount: number;
  }>;

  findUsersWithoutDepartment(organizationId: string): Promise<User[]>;

  findInactiveUsers(daysThreshold: number): Promise<User[]>;

  findUsersByAsset(assetId: string): Promise<User[]>; // Historical assignments

  searchUsersByKeyword(
    organizationId: string,
    keyword: string,
  ): Promise<User[]>;

  getUserPermissions(userId: string): Promise<string[]>; // Returns permission names

  getUserActivitySummary(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<{
    assetsAssigned: number;
    assetsTransferred: number;
    maintenancePerformed: number;
    documentsUploaded: number;
    inventoryChecks: number;
  }>;
}

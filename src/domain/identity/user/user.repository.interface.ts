import { Role } from '../role';
import { User } from './user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface IUserRepository {
  save(user: User): Promise<User>;
  countByOrganizationId(organizationId: string): Promise<number>;
  findByOrganizationId(organizationId: string): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByUsername(
    organizationId: string,
    username: string,
  ): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  getRolesByUserId(userId: string): Promise<Role[]>;
  assignRole(userId: string, roleId: string): Promise<void>;
  removeRole(userId: string, roleId: string): Promise<void>;
}

import { Role } from './role.entity';

export const ROLE_REPOSITORY = Symbol('ROLE_REPOSITORY');

export interface IRoleRepository {
  findByOrganization(organizationId: string): Promise<Role[]>;

  findById(roleId: string): Promise<Role | null>;

  findByName(organizationId: string, roleName: string): Promise<Role | null>;

  save(role: Role): Promise<Role>;
}

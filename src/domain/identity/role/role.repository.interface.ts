import { Role } from './role.entity';

export const ROLE_REPOSITORY = Symbol('ROLE_REPOSITORY');

export interface IRoleRepository {
  find(organizationId: string): Promise<Role[]>;
  findById(id: string): Promise<Role | null>;
  findByName(organizationId: string, name: string): Promise<Role | null>;
  save(role: Role): Promise<Role>;
}

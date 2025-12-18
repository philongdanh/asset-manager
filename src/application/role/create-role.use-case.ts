import { Injectable, Inject } from '@nestjs/common';
import { ROLE_REPOSITORY, Role, type IRoleRepository } from 'src/domain/role';
import {
  Permission,
  PERMISSION_REPOSITORY,
  type IPermissionRepository,
} from 'src/domain/permission';
import { ID_GENERATOR, type IIdGenerator } from 'src/shared/domain/interfaces';

export interface CreateRoleCommand {
  organizationId: string;
  name: string;
  permissionIds: string[];
}

@Injectable()
export class CreateRoleUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
  ) {}

  async execute(command: CreateRoleCommand): Promise<Role> {
    const { organizationId, name, permissionIds } = command;

    if (!organizationId) {
      throw new Error('Organization ID is required.');
    }
    if (!name) {
      throw new Error('Role name is required.');
    }

    const existingRole = await this.roleRepository.findByName(
      organizationId,
      name,
    );
    if (existingRole) {
      throw new Error(
        `Role with name "${name}" already exists in this organization.`,
      );
    }

    const permissions: Permission[] = [];
    if (permissionIds && permissionIds.length > 0) {
      for (const permId of permissionIds) {
        const permission = await this.permissionRepository.findById(permId);
        if (!permission) {
          throw new Error(`Permission with ID "${permId}" not found.`);
        }
        permissions.push(permission);
      }
    }

    const id = this.idGenerator.generate();
    const newRole = Role.createNew(id, organizationId, name, permissions);

    return this.roleRepository.save(newRole);
  }
}

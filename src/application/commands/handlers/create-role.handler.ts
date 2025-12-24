import { Injectable, Inject } from '@nestjs/common';
import { CreateRoleCommand } from 'src/application/commands/create-role.command';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  ROLE_REPOSITORY,
  type IRoleRepository,
  Role,
} from 'src/domain/identity/role';

@Injectable()
export class CreateRoleHandler {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(command: CreateRoleCommand): Promise<Role> {
    // Validate unique constraint
    const existsByName = await this.roleRepository.existsByName(
      command.organizationId,
      command.roleName,
    );
    if (existsByName) {
      throw new UseCaseException(
        `Role with name ${command.roleName} already exists in this organization`,
        CreateRoleCommand.name,
      );
    }

    try {
      // Build role entity
      const builder = Role.builder(
        command.id,
        command.organizationId,
        command.roleName,
      );

      const role = builder.build();

      // Save to repository
      return await this.roleRepository.save(role);
    } catch (err) {
      console.error(err);
      throw new UseCaseException(
        'Failed to create role',
        CreateRoleCommand.name,
      );
    }
  }
}

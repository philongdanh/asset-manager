import { Injectable, Inject } from '@nestjs/common';
import { RestoreRoleCommand } from 'src/application/commands/restore-role.command';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  ROLE_REPOSITORY,
  type IRoleRepository,
} from 'src/domain/identity/role';

@Injectable()
export class RestoreRoleHandler {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(command: RestoreRoleCommand): Promise<void> {
    const role = await this.roleRepository.findById(command.roleId);

    if (!role) {
      throw new UseCaseException(
        `Role with ID ${command.roleId} not found`,
        RestoreRoleCommand.name,
      );
    }

    try {
      await this.roleRepository.restore(command.roleId);
    } catch (err) {
      console.error(err);
      throw new UseCaseException(
        'Failed to restore role',
        RestoreRoleCommand.name,
      );
    }
  }
}

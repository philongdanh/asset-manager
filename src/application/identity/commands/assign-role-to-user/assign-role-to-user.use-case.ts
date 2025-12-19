import { Inject, Injectable } from '@nestjs/common';
import { EntityNotFoundException } from 'src/domain/core';
import {
  type IRoleRepository,
  Role,
  ROLE_REPOSITORY,
} from 'src/domain/identity/role';
import {
  type IUserRepository,
  User,
  USER_REPOSITORY,
} from 'src/domain/identity/user';
import { AssignRoleToUserCommand } from './assign-role-to-user.command';

@Injectable()
export class AssignRoleUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: IUserRepository,
    @Inject(ROLE_REPOSITORY)
    private roleRepository: IRoleRepository,
  ) {}

  async execute(command: AssignRoleToUserCommand): Promise<void> {
    const existingUser = await this.userRepository.findById(command.userId);
    if (!existingUser) {
      throw new EntityNotFoundException(User.name, command.userId);
    }

    const existingRole = await this.roleRepository.findById(command.roleId);
    if (!existingRole) {
      throw new EntityNotFoundException(Role.name, command.roleId);
    }

    await this.userRepository.assignRole(command.userId, command.roleId);
  }
}

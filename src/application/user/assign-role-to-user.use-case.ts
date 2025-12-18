import { EntityNotFoundException } from 'src/domain/core';
import { IRoleRepository, Role } from 'src/domain/identity/role';
import { IUserRepository, User } from 'src/domain/identity/user';

export class AssignRoleUseCase {
  constructor(
    private userRepository: IUserRepository,
    private roleRepository: IRoleRepository,
  ) {}

  async execute(userId: string, roleId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new EntityNotFoundException(User.name, userId);
    }

    const role = await this.roleRepository.findById(roleId);
    if (!role) {
      throw new EntityNotFoundException(Role.name, roleId);
    }

    await this.userRepository.assignRole(userId, roleId);
  }
}

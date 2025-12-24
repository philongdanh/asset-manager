import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  USER_REPOSITORY,
  type IUserRepository,
  User,
  UserStatus,
} from 'src/domain/identity/user';
import { CreateUserCommand } from '../create-user.command';

@Injectable()
export class CreateUserHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    // Validate unique constraints
    const existsByEmail = await this.userRepository.existsByEmail(
      command.email,
    );
    if (existsByEmail) {
      throw new UseCaseException(
        `User with email ${command.email} already exists`,
        CreateUserCommand.name,
      );
    }

    const existsByUsername = await this.userRepository.existsByUsername(
      command.organizationId,
      command.username,
    );
    if (existsByUsername) {
      throw new UseCaseException(
        `Username ${command.username} already exists in this organization`,
        CreateUserCommand.name,
      );
    }

    try {
      // Build user entity
      const builder = User.builder(
        command.id,
        command.organizationId,
        command.username,
        command.email,
      )
        .inDepartment(command.departmentId || null)
        .withStatus((command.status as UserStatus) || UserStatus.ACTIVE);

      const user = builder.build();

      // Save to repository
      return await this.userRepository.save(user);
    } catch (err) {
      console.error(err);
      throw new UseCaseException(
        'Failed to create user',
        CreateUserCommand.name,
      );
    }
  }
}

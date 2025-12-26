import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  USER_REPOSITORY,
  type IUserRepository,
  User,
  UserStatus,
} from 'src/domain/identity/user';
import { CreateUserCommand } from '../create-user.command';
import { ID_GENERATOR, type IIdGenerator } from 'src/domain/core/interfaces';

@Injectable()
export class CreateUserHandler {
  constructor(
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
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

    const id = this.idGenerator.generate();
    const user = User.builder(
      id,
      command.organizationId,
      command.username,
      command.password,
      command.email,
    )
      .inDepartment(command.departmentId || null)
      .withStatus((command.status as UserStatus) || UserStatus.ACTIVE)
      .build();
    return await this.userRepository.save(user);
  }
}

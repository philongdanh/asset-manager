import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import { ID_GENERATOR, type IIdGenerator } from 'src/domain/core/interfaces';
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
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(cmd: CreateUserCommand): Promise<User> {
    const existsByEmail = await this.userRepo.existsByEmail(cmd.email);
    if (existsByEmail) {
      throw new UseCaseException(
        `User with email ${cmd.email} already exists`,
        CreateUserCommand.name,
      );
    }

    const existsByUsername = await this.userRepo.existsByUsername(
      cmd.organizationId,
      cmd.username,
    );
    if (existsByUsername) {
      throw new UseCaseException(
        `Username ${cmd.username} already exists in this organization`,
        CreateUserCommand.name,
      );
    }

    const id = this.idGenerator.generate();
    const user = User.builder(
      id,
      cmd.organizationId,
      cmd.username,
      cmd.password,
      cmd.email,
    )
      .inDepartment(cmd.departmentId || null)
      .withStatus(cmd.status || UserStatus.ACTIVE)
      .build();
    return await this.userRepo.save(user);
  }
}

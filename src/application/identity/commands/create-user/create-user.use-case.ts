import {
  type IUserRepository,
  User,
  USER_REPOSITORY,
} from 'src/domain/identity/user';
import { CreateUserCommand } from './create-user.command';
import { UseCaseException } from 'src/application/exceptions/use-case.exception';
import { Inject, Injectable } from '@nestjs/common';
import { ID_GENERATOR, type IIdGenerator } from 'src/shared/domain/interfaces';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const existingEmail = await this.userRepository.findByEmail(command.email);
    if (existingEmail) {
      throw new UseCaseException(
        'Email already in use',
        CreateUserUseCase.name,
      );
    }

    const existingUsername = await this.userRepository.findByUsername(
      command.organizationId,
      command.username,
    );
    if (existingUsername) {
      throw new UseCaseException(
        'Username is already taken in this organization.',
        CreateUserUseCase.name,
      );
    }

    const id = this.idGenerator.generate();
    const user = new User(
      id,
      command.organizationId,
      command.username,
      command.email,
      command.department,
    );
    return user;
  }
}

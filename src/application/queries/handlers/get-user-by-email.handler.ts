import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  USER_REPOSITORY,
  type IUserRepository,
  User,
} from 'src/domain/identity/user';
import { GetUserByEmailQuery } from '../get-user-by-email.query';

@Injectable()
export class GetUserByEmailHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetUserByEmailQuery): Promise<User> {
    const user = await this.userRepository.findByEmail(query.email);

    if (!user) {
      throw new UseCaseException(
        `User with email ${query.email} not found`,
        GetUserByEmailQuery.name,
      );
    }

    return user;
  }
}

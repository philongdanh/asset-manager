import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  User,
  USER_REPOSITORY,
  type IUserRepository,
} from 'src/domain/identity/user';
import { GetUserByIdQuery } from '../get-user-by-id.query';

@Injectable()
export class GetUserByIdHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetUserByIdQuery): Promise<User> {
    const user = await this.userRepository.findById(query.userId);

    if (!user) {
      throw new UseCaseException(
        `User with ID ${query.userId} not found`,
        GetUserByIdQuery.name,
      );
    }

    return user;
  }
}

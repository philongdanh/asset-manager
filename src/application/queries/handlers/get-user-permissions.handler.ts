import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from 'src/domain/identity/user';
import { GetUserPermissionsQuery } from '../get-user-permissions.query';

@Injectable()
export class GetUserPermissionsHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetUserPermissionsQuery): Promise<string[]> {
    const user = await this.userRepository.findById(query.userId);

    if (!user) {
      throw new UseCaseException(
        `User with ID ${query.userId} not found`,
        GetUserPermissionsQuery.name,
      );
    }

    return await this.userRepository.getUserPermissions(query.userId);
  }
}

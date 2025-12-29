import { Injectable, Inject } from '@nestjs/common';
import { type IUserRepository, USER_REPOSITORY, User } from '../../../domain';
import { GetUsersQuery } from './get-users.query';

@Injectable()
export class GetUsersHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(
    query: GetUsersQuery,
  ): Promise<{ data: User[]; total: number }> {
    return await this.userRepo.find(query.organizationId, query.options);
  }
}

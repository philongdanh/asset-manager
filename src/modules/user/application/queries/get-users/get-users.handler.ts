import { Injectable, Inject } from '@nestjs/common';
import { type IUserRepository, USER_REPOSITORY, User } from '../../../domain';
import { GetUsersQuery } from './get-users.query';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
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

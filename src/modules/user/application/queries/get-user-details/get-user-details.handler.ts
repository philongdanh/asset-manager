import { Inject } from '@nestjs/common';
import { type IUserRepository, User, USER_REPOSITORY } from '../../../domain';
import { GetUserDetailsQuery } from './get-user-details.query';
import { EntityNotFoundException } from 'src/shared/domain';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetUserDetailsQuery)
export class GetUserDetailsHandler implements IQueryHandler<GetUserDetailsQuery> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(query: GetUserDetailsQuery): Promise<User> {
    const user = await this.userRepo.findById(query.userId);
    if (!user) {
      throw new EntityNotFoundException(User.name, query.userId);
    }
    return user;
  }
}

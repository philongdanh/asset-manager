import { Injectable, Inject } from '@nestjs/common';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from 'src/domain/identity/user';
import { GetUsersSummaryQuery } from '../get-users-summary.query';

@Injectable()
export class GetUsersSummaryHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetUsersSummaryQuery) {
    return await this.userRepository.getUsersSummary(query.organizationId);
  }
}

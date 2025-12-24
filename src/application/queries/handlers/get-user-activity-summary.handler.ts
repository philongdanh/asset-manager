import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from 'src/domain/identity/user';
import { GetUserActivitySummaryQuery } from '../get-user-activity-summary.query';

@Injectable()
export class GetUserActivitySummaryHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetUserActivitySummaryQuery) {
    const user = await this.userRepository.findById(query.userId);

    if (!user) {
      throw new UseCaseException(
        `User with ID ${query.userId} not found`,
        GetUserActivitySummaryQuery.name,
      );
    }

    return await this.userRepository.getUserActivitySummary(
      query.userId,
      query.startDate,
      query.endDate,
    );
  }
}

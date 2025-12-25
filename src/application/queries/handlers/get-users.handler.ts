import { Injectable, Inject } from '@nestjs/common';
import {
  type IUserRepository,
  USER_REPOSITORY,
} from 'src/domain/identity/user';
import { GetUsersQuery } from '../get-users.query';

@Injectable()
export class GetUsersHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(cmd: GetUsersQuery) {
    return await this.userRepo.find(cmd.organizationId, cmd.options);
  }
}

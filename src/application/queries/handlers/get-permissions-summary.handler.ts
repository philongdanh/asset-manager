import { Injectable, Inject } from '@nestjs/common';
import {
  PERMISSION_REPOSITORY,
  type IPermissionRepository,
} from 'src/domain/identity/permission';
import { GetPermissionsSummaryQuery } from '../get-permissions-summary.query';

@Injectable()
export class GetPermissionsSummaryHandler {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(query: GetPermissionsSummaryQuery) {
    console.log(GetPermissionsSummaryHandler.name, query);
    return await this.permissionRepository.getPermissionsSummary();
  }
}

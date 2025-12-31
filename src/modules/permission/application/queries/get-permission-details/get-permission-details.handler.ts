import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPermissionDetailsQuery } from './get-permission-details.query';
import {
  PERMISSION_REPOSITORY,
  type IPermissionRepository,
  Permission,
} from '../../../domain';

@QueryHandler(GetPermissionDetailsQuery)
export class GetPermissionDetailsHandler implements IQueryHandler<GetPermissionDetailsQuery> {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(query: GetPermissionDetailsQuery): Promise<Permission> {
    const permission = await this.permissionRepository.findById(
      query.permissionId,
    );
    if (!permission) {
      throw new NotFoundException(
        `Permission with ID ${query.permissionId} not found`,
      );
    }
    return permission;
  }
}

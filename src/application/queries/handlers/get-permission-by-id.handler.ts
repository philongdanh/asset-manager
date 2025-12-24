import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  PERMISSION_REPOSITORY,
  type IPermissionRepository,
  Permission,
} from 'src/domain/identity/permission';
import { GetPermissionByIdQuery } from '../get-permission-by-id.query';

@Injectable()
export class GetPermissionByIdHandler {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(query: GetPermissionByIdQuery): Promise<Permission> {
    const permission = await this.permissionRepository.findById(
      query.permissionId,
    );

    if (!permission) {
      throw new UseCaseException(
        `Permission with ID ${query.permissionId} not found`,
        GetPermissionByIdQuery.name,
      );
    }

    return permission;
  }
}

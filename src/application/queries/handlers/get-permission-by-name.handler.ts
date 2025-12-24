import { Injectable, Inject } from '@nestjs/common';
import { Permission } from 'generated/prisma/browser';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  PERMISSION_REPOSITORY,
  type IPermissionRepository,
} from 'src/domain/identity/permission';
import { GetPermissionByNameQuery } from '../get-permission-by-name.query';

@Injectable()
export class GetPermissionByNameHandler {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(query: GetPermissionByNameQuery): Promise<Permission> {
    const permission = await this.permissionRepository.findByName(query.name);

    if (!permission) {
      throw new UseCaseException(
        `Permission with name ${query.name} not found`,
        GetPermissionByNameQuery.name,
      );
    }

    return permission;
  }
}

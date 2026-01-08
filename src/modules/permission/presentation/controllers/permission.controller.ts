import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  PermissionResponse,
  PermissionListRespone,
} from 'src/modules/permission/presentation/dto';
import { GetPermissionsQuery } from 'src/modules/permission/application/queries/get-permissions/get-permissions.query';
import { GetPermissionDetailsQuery } from 'src/modules/permission/application/queries/get-permission-details/get-permission-details.query';
import { Permissions } from 'src/modules/auth/presentation/decorators/permissions.decorator';
import {
  PermissionListResult,
  PermissionResult,
} from 'src/modules/permission/application/dtos/permission.result';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly queryBus: QueryBus) {}

  @Permissions('PERMISSION_VIEW')
  @Get()
  async getList(): Promise<PermissionListRespone> {
    const result = await this.queryBus.execute<
      GetPermissionsQuery,
      PermissionListResult
    >(new GetPermissionsQuery());
    return new PermissionListRespone(result);
  }

  @Permissions('PERMISSION_VIEW')
  @Get(':id')
  async getDetails(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<PermissionResponse> {
    const result = await this.queryBus.execute<
      GetPermissionDetailsQuery,
      PermissionResult
    >(new GetPermissionDetailsQuery(id));
    return new PermissionResponse(result);
  }
}

import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreatePermissionRequest,
  UpdatePermissionRequest,
  PermissionResponse,
  PermissionListRespone,
} from '../dto';
import {
  GetPermissionsQuery,
  GetPermissionDetailsQuery,
} from '../../application';
import { Permissions } from 'src/modules/auth/presentation';
import { Permission } from '../../domain';
import { PermissionListResult, PermissionResult } from '../../application/dtos';

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

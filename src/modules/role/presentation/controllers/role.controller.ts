import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateRoleRequest,
  GetRolesRequest,
  UpdateRoleRequest,
  RoleResponse,
} from '../dto';
import {
  CreateRoleCommand,
  UpdateRoleCommand,
  DeleteRoleCommand,
  GetRolesQuery,
  GetRoleDetailsQuery,
} from '../../application';
import { CurrentUser, Permissions } from 'src/modules/auth/presentation';
import type { JwtPayload } from 'src/modules/auth/presentation/interfaces/jwt-payload.interface';
import { Role } from '../../domain';

@Controller('roles')
export class RoleController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }

  @Permissions('ROLE_VIEW')
  @Get()
  async getList(
    @CurrentUser() user: JwtPayload,
    @Query() query: GetRolesRequest,
  ): Promise<{ data: RoleResponse[]; total: number }> {
    if (user.isRoot) {
      if (!query.organizationId) {
        throw new BadRequestException('Organization ID is required for root users');
      }
    } else {
      if (!user.organizationId) {
        throw new BadRequestException('User does not belong to any organization');
      }
      query.organizationId = user.organizationId;
    }

    const result: { data: Role[]; total: number } = await this.queryBus.execute(
      new GetRolesQuery(query.organizationId),
    );
    return {
      data: result.data.map((role) => new RoleResponse(role)),
      total: result.total,
    };
  }

  @Permissions('ROLE_VIEW')
  @Get(':id')
  async getDetails(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<RoleResponse> {
    const orgId = user.isRoot ? undefined : user.organizationId;
    if (!user.isRoot && !orgId) {
      // Should not happen if auth middleware works correctly for non-root users
      throw new BadRequestException('User does not belong to any organization');
    }
    const role: Role = await this.queryBus.execute(
      new GetRoleDetailsQuery(id, orgId || undefined),
    );
    return new RoleResponse(role);
  }

  @HttpCode(HttpStatus.CREATED)
  @Permissions('ROLE_CREATE')
  @Post()
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateRoleRequest,
  ): Promise<RoleResponse> {
    if (user.isRoot) {
      if (!dto.organizationId) {
        throw new BadRequestException('Organization ID is required for root users');
      }
    } else {
      if (!user.organizationId) {
        throw new BadRequestException('User does not belong to any organization');
      }
      dto.organizationId = user.organizationId;
    }

    const cmd = new CreateRoleCommand(
      dto.organizationId,
      dto.name,
      dto.permissionIds,
    );
    const role: Role = await this.commandBus.execute(cmd);
    return new RoleResponse(role);
  }

  @Permissions('ROLE_UPDATE')
  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateRoleRequest,
    @CurrentUser() user: JwtPayload,
  ): Promise<RoleResponse> {
    const orgId = user.isRoot ? undefined : user.organizationId;
    if (!user.isRoot && !orgId) {
      throw new BadRequestException('User does not belong to any organization');
    }

    const cmd = new UpdateRoleCommand(
      id,
      dto.name,
      dto.permissionIds,
      orgId || undefined,
    );
    const role: Role = await this.commandBus.execute(cmd);
    return new RoleResponse(role);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions('ROLE_DELETE')
  @Delete(':id')
  async delete(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    await this.commandBus.execute(new DeleteRoleCommand(id));
  }
}

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
    if (user.isRoot && !query.organizationId) {
      throw new BadRequestException(
        'Organization ID is required for root users',
      );
    }
    // For non-root users, the repository will automatically filter by their organization
    // via TenantContext, overriding any organizationId passed in the query.

    const result: { data: Role[]; total: number } = await this.queryBus.execute(
      new GetRolesQuery(query.organizationId),
    );
    return {
      data: result.data.map((role) => new RoleResponse(role, [])),
      total: result.total,
    };
  }

  @Permissions('ROLE_VIEW')
  @Get(':id')
  async getDetails(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<RoleResponse> {
    const { role, permissions } = await this.queryBus.execute(
      new GetRoleDetailsQuery(id),
    );
    return new RoleResponse(role, permissions);
  }

  @HttpCode(HttpStatus.CREATED)
  @Permissions('ROLE_CREATE')
  @Post()
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateRoleRequest,
  ): Promise<RoleResponse> {
    if (user.isRoot && !dto.organizationId) {
      throw new BadRequestException(
        'Organization ID is required for root users',
      );
    }
    // For non-root users, we use their organizationId.
    const orgId = user.isRoot ? dto.organizationId : user.organizationId;

    if (!orgId) {
      // Should catch if create request comes from user without org (unlikely if guarded)
      throw new BadRequestException('Organization ID is missing');
    }

    const cmd = new CreateRoleCommand(
      orgId,
      dto.name,
      dto.permissionIds,
    );
    const role: Role = await this.commandBus.execute(cmd);
    return new RoleResponse(role, []);
  }

  @Permissions('ROLE_UPDATE')
  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateRoleRequest,
  ): Promise<RoleResponse> {
    const cmd = new UpdateRoleCommand(id, dto.name, dto.permissionIds);
    const role: Role = await this.commandBus.execute(cmd);
    return new RoleResponse(role, []);
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

import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  Get,
  Query,
  Param,
  ParseUUIDPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CurrentUser,
  Permissions,
  Public,
} from '../../../auth/presentation/decorators';
import type { JwtPayload } from '../../../auth/presentation/interfaces/jwt-payload.interface';
import {
  CreateOrganizationCommand,
  UpdateOrganizationCommand,
  DeleteOrganizationCommand,
} from '../../application/commands';
import {
  GetOrganizationsQuery,
  GetOrganizationDetailsQuery,
} from '../../application/queries';
import {
  CreateOrganizationRequest,
  GetOrganizationsRequest,
  UpdateOrganizationRequest,
  OrganizationResponse,
} from '../dto';
import { Organization } from '../../domain';

@Controller('organizations')
export class OrganizationController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Permissions('ORGANIZATION_CREATE')
  @Post()
  async create(
    @Body() dto: CreateOrganizationRequest,
    @CurrentUser() user: JwtPayload,
  ): Promise<OrganizationResponse> {
    const cmd = new CreateOrganizationCommand(
      dto.name,
      dto.status,
      dto.phone || null,
      dto.email || null,
      dto.taxCode || null,
      dto.website || null,
      dto.address || null,
      dto.logoUrl || null,
    );
    // Example usage of user
    console.log('User creating organization:', user);

    const org = await this.commandBus.execute<
      CreateOrganizationCommand,
      Organization
    >(cmd);
    return new OrganizationResponse(org);
  }

  @Public()
  @Get()
  async getList(
    @Query() query: GetOrganizationsRequest,
  ): Promise<OrganizationResponse[]> {
    const orgs: Organization[] = await this.queryBus.execute(
      new GetOrganizationsQuery(query.status, query.includeDeleted),
    );
    return orgs.map((org) => new OrganizationResponse(org));
  }

  @Public()
  @Get(':id')
  async getDetails(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<OrganizationResponse> {
    const org: Organization = await this.queryBus.execute(
      new GetOrganizationDetailsQuery(id),
    );
    return new OrganizationResponse(org);
  }

  @Permissions('ORGANIZATION_UPDATE')
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateOrganizationRequest,
    @CurrentUser() user: JwtPayload,
  ): Promise<OrganizationResponse> {
    const cmd = new UpdateOrganizationCommand(
      id,
      dto.name,
      dto.status,
      dto.phone,
      dto.email,
      dto.taxCode,
      dto.website,
      dto.address,
      dto.logoUrl,
    );
    // Example usage of user
    console.log('User updating organization:', user);

    const org: Organization = await this.commandBus.execute(cmd);
    return new OrganizationResponse(org);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions('ORGANIZATION_DELETE')
  @Delete(':id')
  async delete(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    await this.commandBus.execute(new DeleteOrganizationCommand(id));
  }
}

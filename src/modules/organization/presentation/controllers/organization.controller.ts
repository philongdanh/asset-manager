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
  Put,
  Delete,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Permissions, Public } from '../../../auth/presentation/decorators';
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
    const org: Organization = await this.commandBus.execute(cmd);
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
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateOrganizationRequest,
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

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
} from '@nestjs/common';
import {
  CreateOrganizationCommand,
  CreateOrganizationHandler,
  UpdateOrganizationCommand,
  UpdateOrganizationHandler,
} from '../../application/commands';
import {
  GetOrganizationsQuery,
  GetOrganizationsHandler,
  GetOrganizationDetailsQuery,
  GetOrganizationDetailsHandler,
} from '../../application/queries';
import { Permissions } from 'src/modules/auth/presentation';
import {
  CreateOrganizationRequest,
  GetOrganizationsRequest,
  UpdateOrganizationRequest,
  OrganizationResponse,
} from '../dto';

@Controller('organizations')
export class OrganizationController {
  constructor(
    private readonly createOrgHandler: CreateOrganizationHandler,
    private readonly getOrgsHandler: GetOrganizationsHandler,
    private readonly getOrgDetailsHandler: GetOrganizationDetailsHandler,
    private readonly updateOrgHandler: UpdateOrganizationHandler,
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
    );
    const org = await this.createOrgHandler.execute(cmd);
    return new OrganizationResponse(org);
  }

  @Permissions('ORGANIZATION_VIEW')
  @Get()
  async getList(
    @Query() query: GetOrganizationsRequest,
  ): Promise<OrganizationResponse[]> {
    const orgs = await this.getOrgsHandler.execute(
      new GetOrganizationsQuery(query.status, query.includeDeleted),
    );
    return orgs.map((org) => new OrganizationResponse(org));
  }

  @Permissions('ORGANIZATION_VIEW')
  @Get(':id')
  async getDetails(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<OrganizationResponse> {
    const org = await this.getOrgDetailsHandler.execute(
      new GetOrganizationDetailsQuery(id),
    );
    return new OrganizationResponse(org);
  }

  @Permissions('ORGANIZATION_UPDATE')
  @Patch(':id')
  async updateInfo(
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
    );
    const org = await this.updateOrgHandler.execute(cmd);
    return new OrganizationResponse(org);
  }
}

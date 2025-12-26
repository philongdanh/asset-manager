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
import { CreateOrganizationCommand } from 'src/application/commands';
import {
  CreateOrganizationHandler,
  UpdateOrganizationHandler,
} from 'src/application/commands/handlers';
import { UpdateOrganizationCommand } from 'src/application/commands/update-organization.command';
import {
  GetOrganizationsHandler,
  GetOrganizationDetails,
} from 'src/application/queries/handlers';
import { Public } from '../auth/decorators';
import {
  CreateOrganizationRequest,
  GetOrganizationsRequest,
  GetOrganizationsDto,
  GetOrganizationDetailsResponse,
  UpdateOrganizationRequest,
  UpdateOrganizationResponse,
} from './dto';

@Controller('organizations')
export class OrganizationController {
  constructor(
    private readonly createOrgHandler: CreateOrganizationHandler,
    private readonly getOrgsHandler: GetOrganizationsHandler,
    private readonly getOrgDetailsHandler: GetOrganizationDetails,
    private readonly updateOrgHandler: UpdateOrganizationHandler,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() dto: CreateOrganizationRequest) {
    const cmd = new CreateOrganizationCommand(
      dto.name,
      dto.status,
      dto.phone || null,
      dto.email || null,
      dto.taxCode || null,
      dto.website || null,
      dto.address || null,
    );
    return await this.createOrgHandler.execute(cmd);
  }

  @Public()
  @Get()
  async getList(
    @Query() query: GetOrganizationsRequest,
  ): Promise<GetOrganizationsDto[]> {
    const orgs = await this.getOrgsHandler.execute({
      status: query.status,
      includeDeleted: query.includeDeleted,
    });
    return orgs.map(
      (org) =>
        <GetOrganizationsDto>{
          id: org.id,
          name: org.name,
          taxCode: org.taxCode,
          status: org.status,
          createdAt: org.createdAt,
          updatedAt: org.updatedAt,
        },
    );
  }

  @Public()
  @Get(':id')
  async getDetails(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<GetOrganizationDetailsResponse> {
    const org = await this.getOrgDetailsHandler.execute({
      organizationId: id,
    });
    return <GetOrganizationDetailsResponse>{
      id: org.id,
      name: org.name,
      status: org.status,
      phone: org.phone,
      email: org.email,
      taxCode: org.taxCode,
      website: org.website,
      address: org.address,
      createdAt: org.createdAt,
      updatedAt: org.updatedAt,
    };
  }

  @Public()
  @Patch(':id')
  async updateInfo(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateOrganizationRequest,
  ): Promise<UpdateOrganizationResponse> {
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
    return <UpdateOrganizationResponse>{
      id: org.id,
      name: org.name,
      status: org.status,
      phone: org.phone,
      email: org.email,
      taxCode: org.taxCode,
      website: org.website,
      address: org.address,
      createdAt: org.createdAt,
      updatedAt: org.updatedAt,
    };
  }
}

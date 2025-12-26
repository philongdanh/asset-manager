import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CreateOrganizationCommand } from 'src/application/commands/create-organization.command';
import { CreateOrganizationHandler } from 'src/application/commands/handlers/create-organization.handler';
import { GetOrganizationsHandler } from 'src/application/queries/handlers/get-organizations.handler';
import { GetOrganizationsQuery } from 'src/application/queries/get-organizations.query';
import { Public } from 'src/presentation/auth/decorators';
import { CreateOrganizationDto, GetOrganizationsDto } from './dto';
import { GetOrganizationsRequest } from './dto/requests/get-organizations.dto';

@Controller('organizations')
export class OrganizationController {
  constructor(
    private readonly createOrgHandler: CreateOrganizationHandler,
    private readonly getOrgshandler: GetOrganizationsHandler,
  ) {}

  @Post()
  async create(@Body() dto: CreateOrganizationDto) {
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
  async get(@Query() query: GetOrganizationsRequest) {
    const q = new GetOrganizationsQuery(query.status, query.includeDeleted);
    const orgs = await this.getOrgshandler.execute(q);
    const org = orgs[0];
    return <GetOrganizationsDto>{
      id: org.id,
      name: org.name,
      taxCode: org.taxCode,
      status: org.status,
      createdAt: org.createdAt,
      updatedAt: org.updatedAt,
    };
    // return orgs.map(
    //   (org) =>
    //     <GetOrganizationsDto>{
    //       id: org.id,
    //       name: org.name,
    //       taxCode: org.taxCode,
    //       status: org.status,
    //       createdAt: org.createdAt,
    //       updatedAt: org.updatedAt,
    //     },
    // );
  }

  // @Patch()
  // async update(@Query('id') id: string, @Body() dto: UpdateOrganizationDto) {}
}

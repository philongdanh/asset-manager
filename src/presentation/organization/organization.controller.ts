import {
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  Patch,
  Query,
} from '@nestjs/common';
import { CreateOrganizationCommand } from 'src/application/commands/create-organization.command';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { CreateOrganizationHandler } from 'src/application/commands/handlers/create-organization.handler';
import { GetOrganizationsHandler } from 'src/application/queries/handlers/get-organizations.handler';
import { GetOrganizationsQuery } from 'src/application/queries/get-organizations.query';

@Controller('organizations')
export class OrganizationController {
  constructor(
    private readonly getOrgshandler: GetOrganizationsHandler,
    private readonly createOrgHandler: CreateOrganizationHandler,
  ) {}

  @Get()
  async get(@Query() query: GetOrganizationsQuery) {
    return await this.getOrgshandler.execute(query);
  }

  @Post()
  async create(@Body() dto: CreateOrganizationDto) {
    const cmd = new CreateOrganizationCommand(
      dto.name,
      dto.taxCode,
      dto.status,
      dto.phone,
      dto.email,
      dto.website,
      dto.address,
    );
    return await this.createOrgHandler.execute(cmd);
  }

  @Patch()
  async update(@Query('id') id: string, @Body() dto: UpdateOrganizationDto) {}
}

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
import { CreateOrganizationUseCase } from 'src/application/commands/create-organization/create-organization.use-case';
import { UpdateOrganizationUseCase } from 'src/application/commands/update-organization/update-organization.use-case';
import { FindOrganizationsUseCase } from 'src/application/identity/organization/queries/find-organizations/find-organizations.use-case';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { UpdateOrganizationCommand } from 'src/application/commands/update-organization';

@Controller('organizations')
export class OrganizationController {
  constructor(
    private readonly createOrganizationUseCase: CreateOrganizationUseCase,
    private readonly getOrganizationsUseCase: FindOrganizationsUseCase,
    private readonly updateOrganizationUseCase: UpdateOrganizationUseCase,
  ) {}

  @Get()
  async find() {
    const organizations = await this.getOrganizationsUseCase.execute();
    return organizations;
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(@Body() createOrganizationDto: CreateOrganizationDto) {
    const command = new CreateOrganizationCommand(
      createOrganizationDto.name,
      createOrganizationDto.status,
      createOrganizationDto.taxCode,
      createOrganizationDto.address,
      createOrganizationDto.phone,
      createOrganizationDto.email,
      createOrganizationDto.website,
    );

    const organization = await this.createOrganizationUseCase.execute(command);

    return {
      id: organization.id,
      name: organization.orgName,
      status: organization.status,
      taxCode: organization.taxCode,
      phone: organization.phone,
      email: organization.email,
      website: organization.website,
      address: organization.address,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
    };
  }

  @Patch()
  async update(
    @Query('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    const command = new UpdateOrganizationCommand(
      id,
      updateOrganizationDto.name,
      updateOrganizationDto.status,
    );

    const organization = await this.updateOrganizationUseCase.execute(command);

    return {
      id: organization.id,
      name: organization.orgName,
      status: organization.status,
      taxCode: organization.taxCode,
      phone: organization.phone,
      email: organization.email,
      website: organization.website,
      address: organization.address,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
    };
  }
}

import { Controller, Post, Body, Get, Patch } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import {
  CreateOrganizationUseCase,
  GetOrganizationsUseCase,
  UpdateOrganizationUseCase,
} from 'src/application/organization';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Controller('organizations')
export class OrganizationController {
  constructor(
    private readonly createOrganizationUseCase: CreateOrganizationUseCase,
    private readonly getOrganizationsUseCase: GetOrganizationsUseCase,
    private readonly updateOrganizationUseCase: UpdateOrganizationUseCase,
  ) {}

  @Get()
  async find() {
    const organizations = await this.getOrganizationsUseCase.execute();
    return organizations;
  }

  @Post()
  async create(@Body() createOrganizationDto: CreateOrganizationDto) {
    const organization = await this.createOrganizationUseCase.execute({
      name: createOrganizationDto.name,
      status: createOrganizationDto.status,
    });

    return {
      id: organization.id,
      name: organization.name,
      status: organization.status,
    };
  }

  @Patch()
  async update(@Body() updateOrganizationDto: UpdateOrganizationDto) {
    const { name, status } = updateOrganizationDto;
    const organizationId = 'hello-world';
    await this.updateOrganizationUseCase.execute(organizationId, name, status);
  }
}

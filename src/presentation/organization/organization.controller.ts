import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import {
  CreateOrganizationUseCase,
  GetOrganizationsUseCase,
} from 'src/application/organization';

@Controller('organizations')
export class OrganizationController {
  constructor(
    private readonly createOrganizationUseCase: CreateOrganizationUseCase,
    private readonly getOrganizationsUseCase: GetOrganizationsUseCase,
  ) {}

  @Get()
  async find() {
    const organizations = await this.getOrganizationsUseCase.execute('dsajk');
    return organizations.map((org) => ({
      id: org.id,
      name: org.name,
      status: org.status,
    }));
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
}

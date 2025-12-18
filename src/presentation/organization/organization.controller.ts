import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreateOrgDto } from './dto/create-organization.dto';
import {
  CreateOrganizationUseCase,
  GetOrganizationsUseCase,
} from 'src/application/organization';

@Controller('organizations')
export class OrganizationController {
  constructor(
    private readonly createOrgUseCase: CreateOrganizationUseCase,
    private readonly getOrgUseCase: GetOrganizationsUseCase,
  ) {}

  @Get()
  async find() {
    const organizations = await this.getOrgUseCase.execute({});
    return organizations;
    return organizations.map((org) => ({
      id: org.id,
      name: org.name,
      status: org.status,
    }));
  }

  @Post()
  async create(@Body() dto: CreateOrgDto) {
    const result = await this.createOrgUseCase.execute({
      name: dto.name,
      status: dto.status,
    });

    return {
      id: result.id,
      name: result.name,
      status: result.status,
    };
  }
}

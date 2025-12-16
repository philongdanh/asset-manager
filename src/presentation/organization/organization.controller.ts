// src/presentation/asset/asset.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { CreateOrgDto } from './dto/create-organization.dto';
import { CreateOrganizationUseCase } from 'src/application/organization';

@Controller('organizations')
export class OrgController {
  constructor(private readonly createOrgUseCase: CreateOrganizationUseCase) {}

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

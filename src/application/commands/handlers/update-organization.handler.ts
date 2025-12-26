import { Injectable, Inject } from '@nestjs/common';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
  Organization,
} from 'src/domain/identity/organization';
import { UpdateOrganizationCommand } from '../update-organization.command';
import { EntityNotFoundException } from 'src/domain/core';

@Injectable()
export class UpdateOrganizationHandler {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly orgRepo: IOrganizationRepository,
  ) {}

  async execute(cmd: UpdateOrganizationCommand): Promise<Organization> {
    const org = await this.orgRepo.findById(cmd.id);
    if (!org) {
      throw new EntityNotFoundException(Organization.name, cmd.id);
    }
    org.updateInfo(
      cmd.name || undefined,
      cmd.phone || null,
      cmd.email || null,
      cmd.taxCode || null,
      cmd.website || null,
    );
    if (cmd.status !== undefined) {
      org.withStatus(cmd.status);
    }
    return await this.orgRepo.save(org);
  }
}

import { Injectable, Inject } from '@nestjs/common';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
  Organization,
  OrganizationStatus,
} from 'src/domain/identity/organization';
import { CreateOrganizationCommand } from '../create-organization.command';
import { ID_GENERATOR, type IIdGenerator } from 'src/shared/domain/interfaces';

@Injectable()
export class CreateOrganizationHandler {
  constructor(
    @Inject(ID_GENERATOR)
    private readonly idGenerator: IIdGenerator,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(command: CreateOrganizationCommand): Promise<Organization> {
    // Validate unique constraints
    if (command.taxCode) {
      const existsByTaxCode = await this.organizationRepository.existsByTaxCode(
        command.taxCode,
      );
      if (existsByTaxCode) {
        throw new Error(
          `Organization with tax code ${command.taxCode} already exists`,
        );
      }
    }

    if (command.email) {
      const existsByEmail = await this.organizationRepository.existsByEmail(
        command.email,
      );
      if (existsByEmail) {
        throw new Error(
          `Organization with email ${command.email} already exists`,
        );
      }
    }

    // Build organization entity
    const id = this.idGenerator.generate();
    const builder = Organization.builder(id, command.name)
      .withStatus(command.status || OrganizationStatus.ACTIVE)
      .withTaxCode(command.taxCode || null)
      .withAddress(command.address || null)
      .withContactInfo(
        command.phone || null,
        command.email || null,
        command.website || null,
      );

    const organization = builder.build();
    return await this.organizationRepository.save(organization);
  }
}

import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/application/core/exceptions';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
  Organization,
  OrganizationStatus,
} from 'src/domain/identity/organization';
import { ID_GENERATOR, type IIdGenerator } from 'src/shared/domain/interfaces';
import { CreateOrganizationCommand } from '../create-organization.command';

@Injectable()
export class CreateOrganizationHandler {
  constructor(
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly orgRepo: IOrganizationRepository,
  ) {}

  async execute(command: CreateOrganizationCommand): Promise<Organization> {
    if (command.taxCode) {
      const existsByTaxCode = await this.orgRepo.existsByTaxCode(
        command.taxCode,
      );
      if (existsByTaxCode) {
        throw new UseCaseException(
          `Organization with tax code ${command.taxCode} already exists`,
          CreateOrganizationCommand.name,
        );
      }
    }

    const id = this.idGenerator.generate();
    const org = Organization.builder(id, command.name)
      .withStatus(command.status || OrganizationStatus.ACTIVE)
      .withTaxCode(command.taxCode || null)
      .withContactInfo(
        command.phone || null,
        command.email || null,
        command.website || null,
        command.address || null,
      )
      .build();
    return await this.orgRepo.save(org);
  }
}

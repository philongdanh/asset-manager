import { Injectable, Inject } from '@nestjs/common';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
  Organization,
} from 'src/domain/identity/organization';
import { ID_GENERATOR, type IIdGenerator } from 'src/shared/domain/interfaces';
import { CreateOrganizationCommand } from './create-organization.command';
import { EntityAlreadyExistsException } from 'src/domain/core';

@Injectable()
export class CreateOrganizationUseCase {
  constructor(
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(command: CreateOrganizationCommand): Promise<Organization> {
    if (command.taxCode) {
      const existingByTaxCode = await this.organizationRepository.findByTaxCode(
        command.taxCode,
      );
      if (existingByTaxCode) {
        throw new EntityAlreadyExistsException(
          Organization.name,
          'taxCode',
          command.taxCode,
        );
      }
    }

    const id = this.idGenerator.generate();

    const builder = Organization.builder(id, command.name).withStatus(
      command.status,
    );

    if (command.taxCode !== undefined) {
      builder.withTaxCode(command.taxCode);
    }

    if (command.address !== undefined) {
      builder.withAddress(command.address);
    }

    if (
      command.phone !== undefined ||
      command.email !== undefined ||
      command.website !== undefined
    ) {
      builder.withContactInfo(
        command.phone ?? null,
        command.email ?? null,
        command.website ?? null,
      );
    }

    const newOrganization = builder.build();
    return await this.organizationRepository.save(newOrganization);
  }
}

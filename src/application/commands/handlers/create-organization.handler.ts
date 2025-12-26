import { Injectable, Inject } from '@nestjs/common';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
  Organization,
} from 'src/domain/identity/organization';
import { ID_GENERATOR, type IIdGenerator } from 'src/domain/core/interfaces';
import { CreateOrganizationCommand } from 'src/application/commands';

@Injectable()
export class CreateOrganizationHandler {
  constructor(
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly orgRepo: IOrganizationRepository,
  ) {}

  async execute(command: CreateOrganizationCommand): Promise<Organization> {
    const id = this.idGenerator.generate();
    const org = Organization.builder(id, command.name)
      .withStatus(command.status)
      .withTaxCode(command.taxCode)
      .withContactInfo(
        command.phone,
        command.email,
        command.website,
        command.address,
      )
      .build();
    return await this.orgRepo.save(org);
  }
}

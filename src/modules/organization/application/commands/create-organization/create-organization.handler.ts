import { Inject } from '@nestjs/common';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
  Organization,
} from '../../../domain';
import { ID_GENERATOR, type IIdGenerator } from 'src/shared/domain/interfaces';
import { CreateOrganizationCommand } from './create-organization.command';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(CreateOrganizationCommand)
export class CreateOrganizationHandler implements ICommandHandler<
  CreateOrganizationCommand,
  Organization
> {
  constructor(
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly orgRepo: IOrganizationRepository,
  ) {}

  async execute(cmd: CreateOrganizationCommand): Promise<Organization> {
    const id = this.idGenerator.generate();
    const org = Organization.builder(id, cmd.name)
      .withStatus(cmd.status)
      .withTaxCode(cmd.taxCode)
      .withContactInfo(
        cmd.phone,
        cmd.email,
        cmd.website,
        cmd.address,
        cmd.logoUrl,
      )
      .build();
    return await this.orgRepo.save(org);
  }
}

import { Injectable, Inject } from '@nestjs/common';
import {
  ORGANIZATION_REPOSITORY,
  Organization,
  type IOrganizationRepository,
} from 'src/domain/modules/organization';
import { OrganizationStatus } from 'src/domain/modules/organization/organization.entity';
import { ID_GENERATOR, type IIdGenerator } from 'src/shared/domain/interfaces';

export interface CreateOrgCommand {
  name: string;
  status: OrganizationStatus;
}

@Injectable()
export class CreateOrganizationUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly orgRepository: IOrganizationRepository,
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
  ) {}

  async execute(command: CreateOrgCommand): Promise<Organization> {
    const { name: name, status } = command;

    if (!name) {
      throw new Error('Organization name is required.');
    }
    if (name.length > 50) {
      throw new Error('Organization name is too long.');
    }

    const id = this.idGenerator.generate();
    const newOrg = Organization.create(id, name, status);

    return this.orgRepository.save(newOrg);
  }
}

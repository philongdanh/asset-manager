import { Injectable, Inject } from '@nestjs/common';
import {
  ORGANIZATION_REPOSITORY,
  Organization,
  type IOrgRepository,
} from 'src/domain/organization';
import { OrganizationStatus } from 'src/domain/organization/organization.entity';
import { ID_GENERATOR, type IIdGenerator } from 'src/shared/domain/interfaces';

export interface CreateOrgCommand {
  name: string;
  status: OrganizationStatus;
}

@Injectable()
export class CreateOrganizationUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly orgRepository: IOrgRepository,
    @Inject(ID_GENERATOR)
    private readonly idGenerator: IIdGenerator,
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
    const newOrg = Organization.createNew(id, name, status);

    return this.orgRepository.save(newOrg);
  }
}

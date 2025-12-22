import { Injectable, Inject } from '@nestjs/common';
import {
  ORGANIZATION_REPOSITORY,
  Organization,
  type IOrganizationRepository,
} from 'src/domain/modules/organization';
import { ID_GENERATOR, type IIdGenerator } from 'src/shared/domain/interfaces';
import { CreateOrganizationCommand } from './create-organization.command';

@Injectable()
export class CreateOrganizationUseCase {
  constructor(
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(command: CreateOrganizationCommand): Promise<Organization> {
    const id = this.idGenerator.generate();
    const newOrganization = Organization.create(
      id,
      command.name,
      command.status,
    );
    return await this.organizationRepository.save(newOrganization);
  }
}

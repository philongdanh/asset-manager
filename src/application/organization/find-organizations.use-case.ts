import { Injectable, Inject } from '@nestjs/common';
import {
  Organization,
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
} from 'src/domain/modules/organization';

@Injectable()
export class FindOrganizationsUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(): Promise<Organization[]> {
    const organizations = await this.organizationRepository.find();
    return organizations;
  }
}

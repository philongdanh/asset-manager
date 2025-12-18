import { Injectable, Inject } from '@nestjs/common';
import {
  Organization,
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
} from 'src/domain/modules/organization';

@Injectable()
export class GetOrganizationsUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(organizationId: string): Promise<Organization[]> {
    const organizations =
      await this.organizationRepository.find(organizationId);
    return organizations;
  }
}

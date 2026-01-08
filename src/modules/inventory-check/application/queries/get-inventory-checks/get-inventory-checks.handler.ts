import { Injectable, Inject } from '@nestjs/common';
import {
  INVENTORY_CHECK_REPOSITORY,
  type IInventoryCheckRepository,
} from 'src/modules/inventory-check/domain';
import { GetInventoryChecksQuery } from './get-inventory-checks.query';
import { InventoryCheckResult } from '../../dtos/inventory-check.result';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
} from 'src/modules/organization/domain';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from 'src/modules/user/domain';

@Injectable()
export class GetInventoryChecksHandler {
  constructor(
    @Inject(INVENTORY_CHECK_REPOSITORY)
    private readonly repository: IInventoryCheckRepository,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) { }

  async execute(
    query: GetInventoryChecksQuery,
  ): Promise<{ data: InventoryCheckResult[]; total: number }> {
    const { data, total } = await this.repository.findAll(
      query.organizationId,
      query.options,
    );

    // Fetch related entities for each inventory check
    const results = await Promise.all(
      data.map(async (inventoryCheck) => {
        const [organization, checkerUser] = await Promise.all([
          this.organizationRepository.findById(inventoryCheck.organizationId),
          this.userRepository.findById(inventoryCheck.checkerUserId),
        ]);

        return {
          inventoryCheck,
          organization,
          checkerUser,
        };
      }),
    );

    return { data: results, total };
  }
}

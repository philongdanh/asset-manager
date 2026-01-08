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
import { USER_REPOSITORY, type IUserRepository } from 'src/modules/user/domain';
import {
  ASSET_REPOSITORY,
  type IAssetRepository,
} from 'src/modules/asset/domain';

@Injectable()
export class GetInventoryChecksHandler {
  constructor(
    @Inject(INVENTORY_CHECK_REPOSITORY)
    private readonly repository: IInventoryCheckRepository,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: IAssetRepository,
  ) {}

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

        let assets: any[] = [];
        if (inventoryCheck.details.length > 0) {
          const assetIds = inventoryCheck.details.map((d) => d.assetId);
          // Optimize: Fetch all assets in one go if repository supports it,
          // or fetch individually. Since we don't have findByIds, we loop or adding findByIds.
          // For now, let's just fetch individually or assume we can find them.
          // Actually, standard repo usually has findById.
          // A better approach is to add findByIds to AssetRepository, but for now we iterate.
          assets = await Promise.all(
            assetIds.map((id) => this.assetRepository.findById(id)),
          );
          assets = assets.filter((a) => a !== null);
        }

        return {
          inventoryCheck,
          organization,
          checkerUser,
          assets,
        };
      }),
    );

    return { data: results, total };
  }
}

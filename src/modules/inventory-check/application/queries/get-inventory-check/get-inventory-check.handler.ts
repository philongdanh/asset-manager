import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/shared/application/exceptions';
import {
  INVENTORY_CHECK_REPOSITORY,
  type IInventoryCheckRepository,
} from 'src/modules/inventory-check/domain';
import { GetInventoryCheckQuery } from './get-inventory-check.query';
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
export class GetInventoryCheckHandler {
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

  async execute(query: GetInventoryCheckQuery): Promise<InventoryCheckResult> {
    const inventoryCheck = await this.repository.findById(query.id);
    if (!inventoryCheck) {
      throw new UseCaseException(
        'Inventory check not found',
        'GetInventoryCheckQuery',
      );
    }

    const [organization, checkerUser] = await Promise.all([
      this.organizationRepository.findById(inventoryCheck.organizationId),
      this.userRepository.findById(inventoryCheck.checkerUserId),
    ]);

    let assets: any[] = [];
    if (inventoryCheck.details.length > 0) {
      const assetIds = inventoryCheck.details.map((d) => d.assetId);
      // Fetch assets manually since we don't have findByIds yet
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
  }
}

import { Injectable, Inject } from '@nestjs/common';
import { ID_GENERATOR, type IIdGenerator } from 'src/shared/domain/interfaces';
import {
  INVENTORY_CHECK_REPOSITORY,
  type IInventoryCheckRepository,
  InventoryCheck,
  InventoryDetail,
} from 'src/modules/inventory-check/domain';
import { CreateInventoryCheckCommand } from './create-inventory-check.command';
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
export class CreateInventoryCheckHandler {
  constructor(
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
    @Inject(INVENTORY_CHECK_REPOSITORY)
    private readonly repository: IInventoryCheckRepository,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: IAssetRepository,
  ) { }

  async execute(
    cmd: CreateInventoryCheckCommand,
  ): Promise<InventoryCheckResult> {
    const id = this.idGenerator.generate();
    const builder = InventoryCheck.builder(
      id,
      cmd.organizationId,
      cmd.createdByUserId,
    );

    builder.withInventoryName(cmd.name);

    if (cmd.checkDate) builder.withCheckDate(cmd.checkDate);
    if (cmd.notes) builder.withNotes(cmd.notes);

    if (cmd.assetIds && cmd.assetIds.length > 0) {
      const assetPromises = cmd.assetIds.map((assetId) =>
        this.assetRepository.findById(assetId),
      );
      const assets = await Promise.all(assetPromises);

      const details: InventoryDetail[] = [];
      for (const asset of assets) {
        if (!asset) continue;
        if (asset.organizationId !== cmd.organizationId) continue;

        const detailId = this.idGenerator.generate();
        const detailBuilder = InventoryDetail.builder(
          detailId,
          id,
          asset.id,
          asset.status.toString(),
        );

        detailBuilder.withExpectedLocation(asset.location);
        details.push(detailBuilder.build());
      }
      builder.withDetails(details);
    }

    const inventoryCheck = builder.build();
    const savedCheck = await this.repository.save(inventoryCheck);

    const [organization, checkerUser] = await Promise.all([
      this.organizationRepository.findById(savedCheck.organizationId),
      this.userRepository.findById(savedCheck.checkerUserId),
    ]);

    return {
      inventoryCheck: savedCheck,
      organization,
      checkerUser,
    };
  }
}

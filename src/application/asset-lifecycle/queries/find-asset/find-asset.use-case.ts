import { Injectable, Inject } from '@nestjs/common';
import {
  ASSET_REPOSITORY,
  type IAssetRepository,
  Asset,
} from 'src/domain/asset-lifecycle/asset';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
} from 'src/domain/identity/organization';
import { EntityNotFoundException } from 'src/domain/core/exceptions/entity-not-found.exception';
import { FindAssetQuery } from './find-asset.query';

@Injectable()
export class FindAssetUseCase {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: IAssetRepository,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(query: FindAssetQuery): Promise<Asset> {
    const existingOrg = await this.organizationRepository.findById(
      query.organizationId,
    );
    if (!existingOrg) {
      throw new EntityNotFoundException('Organization', query.organizationId);
    }

    const asset = await this.assetRepository.findById(query.assetId);
    if (!asset || asset.organizationId !== query.organizationId) {
      throw new EntityNotFoundException(Asset.name, query.assetId);
    }
    return asset;
  }
}

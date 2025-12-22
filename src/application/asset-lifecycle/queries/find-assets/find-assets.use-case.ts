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
import { FindAssetsQuery } from './find-assets.query';

@Injectable()
export class FindAssetsUseCase {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: IAssetRepository,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(
    query: FindAssetsQuery,
  ): Promise<{ data: Asset[]; total: number }> {
    const existingOrg = await this.organizationRepository.findById(
      query.organizationId,
    );
    if (!existingOrg) {
      throw new EntityNotFoundException('Organization', query.organizationId);
    }

    return await this.assetRepository.findAll(query.organizationId, {
      categoryId: query.categoryId,
      status: query.status,
      limit: query.limit,
      offset: query.offset,
    });
  }
}

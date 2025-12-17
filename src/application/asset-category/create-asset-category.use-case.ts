import { Injectable, Inject } from '@nestjs/common';
import { Asset } from 'src/domain/asset';
import {
  ASSET_CATEGORY_REPOSITORY,
  AssetCategory,
  type IAssetCategoryRepository,
} from 'src/domain/asset-category';
import { ID_GENERATOR, type IIdGenerator } from 'src/shared/domain/interfaces';

export interface CreateAssetCategoryCommand {
  orgId: string;
  name: string;
  code: string;
  parentCategoryId?: string;
  properties?: Map<string, any>;
  subCategories?: Asset[];
}

@Injectable()
export class CreateAssetCategoryUseCase {
  constructor(
    @Inject(ASSET_CATEGORY_REPOSITORY)
    private readonly assetCategoryRepository: IAssetCategoryRepository,
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
  ) {}

  async execute(command: CreateAssetCategoryCommand): Promise<AssetCategory> {
    const { orgId, code, name, parentCategoryId, properties } = command;

    const existingAssetCategory =
      await this.assetCategoryRepository.findByOrgAndCode(orgId, code);
    if (existingAssetCategory) {
      throw new Error(
        `Asset category with code '${code}' already exists in organization '${orgId}'.`,
      );
    }

    const id = this.idGenerator.generate();
    const newAssetCategory = AssetCategory.create(
      id,
      orgId,
      name,
      code,
      parentCategoryId || null,
      properties || new Map<string, any>(),
    );

    return this.assetCategoryRepository.save(newAssetCategory);
  }
}

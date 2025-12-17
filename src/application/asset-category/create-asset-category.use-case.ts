import { Injectable, Inject } from '@nestjs/common';
import { Asset } from 'src/domain/asset';
import {
  ASSET_CATEGORY_REPOSITORY,
  AssetCategory,
  type IAssetCategoryRepository,
} from 'src/domain/asset-category';
import { EntityAlreadyExistsException } from 'src/domain/exceptions/entity-already-exists.exception';
import { EntityNotFoundException } from 'src/domain/exceptions/entity-not-found.exception';
import {
  type IOrgRepository,
  ORGANIZATION_REPOSITORY,
} from 'src/domain/organization';
import { ID_GENERATOR, type IIdGenerator } from 'src/shared/domain/interfaces';

export interface CreateAssetCategoryCommand {
  orgId: string;
  name: string;
  code: string;
  parentId?: string;
  subCategories?: Asset[];
}

@Injectable()
export class CreateAssetCategoryUseCase {
  constructor(
    @Inject(ASSET_CATEGORY_REPOSITORY)
    private readonly assetCategoryRepo: IAssetCategoryRepository,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly orgRepository: IOrgRepository,
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
  ) {}

  async execute(command: CreateAssetCategoryCommand): Promise<AssetCategory> {
    const { orgId, code, name, parentId } = command;

    const organization = await this.orgRepository.findById(orgId);
    if (!organization) {
      throw new EntityNotFoundException('Organization', orgId);
    }

    const existingAssetCategory = await this.assetCategoryRepo.findByOrgAndCode(
      orgId,
      code,
    );
    if (existingAssetCategory) {
      throw new EntityAlreadyExistsException('AssetCategory', 'code', code);
    }

    const id = this.idGenerator.generate();
    const newAssetCategory = AssetCategory.create(
      id,
      orgId,
      name,
      code,
      parentId || null,
    );

    return this.assetCategoryRepo.save(newAssetCategory);
  }
}

import { Injectable, Inject } from '@nestjs/common';
import { UseCaseException } from 'src/shared/application/exceptions';
import { ID_GENERATOR, type IIdGenerator } from 'src/shared/domain/interfaces';
import {
  ASSET_CATEGORY_REPOSITORY,
  type IAssetCategoryRepository,
  AssetCategory,
} from '../../../domain';
import { CreateAssetCategoryCommand } from './create-asset-category.command';

@Injectable()
export class CreateAssetCategoryHandler {
  constructor(
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
    @Inject(ASSET_CATEGORY_REPOSITORY)
    private readonly assetCategoryRepo: IAssetCategoryRepository,
  ) {}

  async execute(cmd: CreateAssetCategoryCommand): Promise<AssetCategory> {
    const existsByCode = await this.assetCategoryRepo.existsByCode(
      cmd.organizationId,
      cmd.code,
    );
    if (existsByCode) {
      throw new UseCaseException(
        `Asset category with code ${cmd.code} already exists`,
        CreateAssetCategoryCommand.name,
      );
    }

    if (cmd.parentId) {
      const parentExists = await this.assetCategoryRepo.existsById(
        cmd.parentId,
      );
      if (!parentExists) {
        throw new UseCaseException(
          `Parent category with id ${cmd.parentId} does not exist`,
          CreateAssetCategoryCommand.name,
        );
      }
    }

    const id = this.idGenerator.generate();
    const assetCategory = AssetCategory.builder(
      id,
      cmd.organizationId,
      cmd.code,
      cmd.categoryName,
    )
      .withParent(cmd.parentId || null)
      .build();

    return await this.assetCategoryRepo.save(assetCategory);
  }
}

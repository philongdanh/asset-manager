import { Injectable, Inject } from '@nestjs/common';
import {
  ASSET_CATEGORY_REPOSITORY,
  AssetCategory,
  type IAssetCategoryRepository,
} from 'src/domain/asset-lifecycle/asset-category';
import { EntityAlreadyExistsException } from 'src/domain/core/exceptions/entity-already-exists.exception';
import { EntityNotFoundException } from 'src/domain/core/exceptions/entity-not-found.exception';
import {
  type IOrganizationRepository,
  ORGANIZATION_REPOSITORY,
} from 'src/domain/identity/organization';
import { ID_GENERATOR, type IIdGenerator } from 'src/shared/domain/interfaces';
import { CreateAssetCategoryCommand } from './create-asset-category.command';

@Injectable()
export class CreateAssetCategoryUseCase {
  constructor(
    @Inject(ASSET_CATEGORY_REPOSITORY)
    private readonly assetCategoryRepository: IAssetCategoryRepository,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
  ) {}

  async execute(command: CreateAssetCategoryCommand): Promise<AssetCategory> {
    const existingOrganization = await this.organizationRepository.findById(
      command.organizationId,
    );
    if (!existingOrganization) {
      throw new EntityNotFoundException('Organization', command.organizationId);
    }

    const isCodeTaken = await this.assetCategoryRepository.existsByCode(
      command.organizationId,
      command.code,
    );
    if (isCodeTaken) {
      throw new EntityAlreadyExistsException(
        'AssetCategory',
        'code',
        command.code,
      );
    }

    if (command.parentId) {
      const parentCategory = await this.assetCategoryRepository.findById(
        command.parentId,
      );
      if (!parentCategory) {
        throw new EntityNotFoundException(
          'Parent AssetCategory',
          command.parentId,
        );
      }
    }

    const id = this.idGenerator.generate();
    const newAssetCategory = AssetCategory.builder(
      id,
      command.organizationId,
      command.code,
      command.name,
    )
      .withParent(command.parentId)
      .build();
    return await this.assetCategoryRepository.save(newAssetCategory);
  }
}

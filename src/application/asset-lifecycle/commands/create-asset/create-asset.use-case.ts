import { Injectable, Inject } from '@nestjs/common';
import {
  ASSET_REPOSITORY,
  type IAssetRepository,
  Asset,
} from 'src/domain/asset-lifecycle/asset';
import {
  EntityAlreadyExistsException,
  EntityNotFoundException,
} from 'src/domain/core';
import {
  ASSET_CATEGORY_REPOSITORY,
  type IAssetCategoryRepository,
} from 'src/domain/asset-lifecycle/asset-category';
import {
  DEPARTMENT_REPOSITORY,
  type IDepartmentRepository,
} from 'src/domain/identity/department';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
} from 'src/domain/identity/organization';
import { ID_GENERATOR, type IIdGenerator } from 'src/shared/domain/interfaces';
import { CreateAssetCommand } from './create-asset.command';

@Injectable()
export class CreateAssetUseCase {
  constructor(
    @Inject(ID_GENERATOR) private readonly idGenerator: IIdGenerator,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: IDepartmentRepository,
    @Inject(ASSET_CATEGORY_REPOSITORY)
    private readonly categoryRepository: IAssetCategoryRepository,
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: IAssetRepository,
  ) {}

  async execute(command: CreateAssetCommand): Promise<Asset> {
    const existingOrg = await this.organizationRepository.findById(
      command.organizationId,
    );
    if (!existingOrg) {
      throw new EntityNotFoundException('Organization', command.organizationId);
    }

    const isCodeTaken = await this.assetRepository.existsByCode(
      command.organizationId,
      command.code,
    );
    if (isCodeTaken) {
      throw new EntityAlreadyExistsException(Asset.name, 'code', command.code);
    }

    const category = await this.categoryRepository.findById(command.categoryId);
    if (!category) {
      throw new EntityNotFoundException('AssetCategory', command.categoryId);
    }

    if (command.departmentId) {
      const dept = await this.departmentRepository.findById(
        command.departmentId,
      );
      if (!dept) {
        throw new EntityNotFoundException('Department', command.departmentId);
      }
    }

    const id = this.idGenerator.generate();

    const builder = Asset.builder(
      id,
      command.organizationId,
      command.code,
      command.name,
    )
      .withCategory(command.categoryId)
      .createdBy(command.createdByUserId) // IMPORTANT
      .withPrice(command.purchasePrice)
      .withPurchaseDate(command.purchaseDate)
      .inDepartment(command.departmentId || null)
      .assignedTo(command.currentUserId || null)
      .withLocation(command.location || null)
      .withSpecifications(command.description || null)
      .withTechnicalDetails(
        command.model || null,
        command.serialNumber || null,
      );

    const newAsset = builder.build();
    return await this.assetRepository.save(newAsset);
  }
}

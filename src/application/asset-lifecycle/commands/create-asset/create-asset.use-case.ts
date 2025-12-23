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
    // 1. Validate organization exists
    const existingOrg = await this.organizationRepository.findById(
      command.organizationId,
    );
    if (!existingOrg) {
      throw new EntityNotFoundException('Organization', command.organizationId);
    }

    // 2. Check for duplicate asset code
    const isCodeTaken = await this.assetRepository.existsByCode(
      command.organizationId,
      command.code,
    );
    if (isCodeTaken) {
      throw new EntityAlreadyExistsException(Asset.name, 'code', command.code);
    }

    // 3. Validate category exists
    const category = await this.categoryRepository.findById(command.categoryId);
    if (!category) {
      throw new EntityNotFoundException('AssetCategory', command.categoryId);
    }

    // 4. Validate department if provided
    if (command.departmentId) {
      const dept = await this.departmentRepository.findById(
        command.departmentId,
      );
      if (!dept || dept.organizationId !== command.organizationId) {
        throw new EntityNotFoundException('Department', command.departmentId);
      }
    }

    // 5. Generate ID and build asset
    const id = this.idGenerator.generate();

    const builder = Asset.builder(
      id,
      command.organizationId,
      command.code,
      command.name,
    )
      .withCategory(command.categoryId)
      .createdBy(command.createdByUserId)
      .withPrice(command.purchasePrice);

    // Optional fields - only set if provided
    if (command.purchaseDate !== undefined) {
      builder.withPurchaseDate(command.purchaseDate);
    }

    if (command.departmentId !== undefined) {
      builder.inDepartment(command.departmentId);
    }

    if (command.currentUserId !== undefined) {
      builder.assignedTo(command.currentUserId);
    }

    if (command.location !== undefined) {
      builder.withLocation(command.location);
    }

    if (command.specifications !== undefined) {
      builder.withSpecifications(command.specifications);
    }

    if (command.model !== undefined) {
      builder.withModel(command.model);
    }

    if (command.serialNumber !== undefined) {
      builder.withSerialNumber(command.serialNumber);
    }

    if (command.manufacturer !== undefined) {
      builder.withManufacturer(command.manufacturer);
    }

    if (command.warrantyExpiryDate !== undefined) {
      builder.withWarrantyExpiryDate(command.warrantyExpiryDate);
    }

    if (command.condition !== undefined) {
      builder.withCondition(command.condition);
    }

    // 6. Build and save asset
    const newAsset = builder.build();
    return await this.assetRepository.save(newAsset);
  }
}

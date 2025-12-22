import { Injectable, Inject } from '@nestjs/common';
import {
  ASSET_REPOSITORY,
  type IAssetRepository,
  Asset,
} from 'src/domain/asset-lifecycle/asset';
import {
  ASSET_CATEGORY_REPOSITORY,
  type IAssetCategoryRepository,
} from 'src/domain/asset-lifecycle/asset-category';
import {
  ORGANIZATION_REPOSITORY,
  type IOrganizationRepository,
} from 'src/domain/identity/organization';
import { EntityNotFoundException } from 'src/domain/core/exceptions/entity-not-found.exception';
import { UpdateAssetCommand } from './update-asset.command';
import { UseCaseException } from 'src/application/core/exceptions/use-case.exception';
import { CreateUserCommand } from 'src/application/identity/commands/create-user/create-user.command';

@Injectable()
export class UpdateAssetUseCase {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: IAssetRepository,
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
    @Inject(ASSET_CATEGORY_REPOSITORY)
    private readonly categoryRepository: IAssetCategoryRepository,
  ) {}

  async execute(command: UpdateAssetCommand): Promise<Asset> {
    const existingOrg = await this.organizationRepository.findById(
      command.organizationId,
    );
    if (!existingOrg) {
      throw new EntityNotFoundException('Organization', command.organizationId);
    }

    const asset = await this.assetRepository.findById(command.assetId);
    if (!asset || asset.organizationId !== command.organizationId) {
      throw new EntityNotFoundException('Asset', command.assetId);
    }

    let finalCategoryId = asset.categoryId;
    if (command.categoryId && command.categoryId !== asset.categoryId) {
      const category = await this.categoryRepository.findById(
        command.categoryId,
      );
      if (!category) {
        throw new EntityNotFoundException('AssetCategory', command.categoryId);
      }
      finalCategoryId = command.categoryId;
    }

    if (command.name !== undefined || command.categoryId !== undefined) {
      asset.updateBasicInfo(
        command.name !== undefined ? command.name : asset.assetName,
        finalCategoryId,
      );
    }

    if (
      command.model !== undefined ||
      command.serialNumber !== undefined ||
      command.manufacturer !== undefined
    ) {
      asset.updateTechnicalDetails(
        command.model !== undefined ? command.model : asset.model,
        command.serialNumber !== undefined
          ? command.serialNumber
          : asset.serialNumber,
        command.manufacturer !== undefined
          ? command.manufacturer
          : asset.manufacturer,
      );
    }

    if (
      command.purchasePrice !== undefined ||
      command.purchaseDate !== undefined ||
      command.warrantyExpiryDate !== undefined
    ) {
      asset.updateFinancials(
        command.purchasePrice !== undefined
          ? command.purchasePrice
          : asset.purchasePrice,
        command.purchaseDate !== undefined
          ? command.purchaseDate
          : asset.purchaseDate,
        command.warrantyExpiryDate !== undefined
          ? command.warrantyExpiryDate
          : asset.warrantyExpiryDate,
      );
    }

    if (
      command.condition !== undefined ||
      command.location !== undefined ||
      command.specifications !== undefined
    ) {
      asset.updatePhysicalCondition(
        command.condition !== undefined ? command.condition : asset.condition,
        command.location !== undefined ? command.location : asset.location,
        command.specifications !== undefined
          ? command.specifications
          : asset.specifications,
      );
    }

    if (command.status !== undefined && command.status !== asset.status) {
      asset.changeStatus(command.status);
    }

    if (
      command.currentUserId !== undefined ||
      command.departmentId !== undefined
    ) {
      const targetUserId =
        command.currentUserId !== undefined
          ? command.currentUserId
          : asset.currentUserId;
      const targetDeptId =
        command.departmentId !== undefined
          ? command.departmentId
          : asset.currentDepartmentId;

      if (targetUserId && targetDeptId) {
        asset.assignToUser(targetUserId, targetDeptId);
      } else if (!targetUserId && !targetDeptId) {
        asset.unassign();
      } else {
        throw new UseCaseException(
          'Both userId and departmentId must be provided together for assignment',
          CreateUserCommand.name,
        );
      }
    }

    return await this.assetRepository.save(asset);
  }
}

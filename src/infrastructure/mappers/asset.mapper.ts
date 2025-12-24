import { Prisma, Asset as PrismaAsset } from 'generated/prisma/client';
import {
  Asset,
  AssetCondition,
  AssetStatus,
} from 'src/domain/asset-lifecycle/asset';

export class AssetMapper {
  static toDomain(raw: PrismaAsset): Asset {
    const builder = Asset.builder(
      raw.id,
      raw.organizationId,
      raw.assetCode,
      raw.assetName,
    )
      .withCategory(raw.categoryId)
      .createdBy(raw.createdByUserId)
      .withPrice(raw.purchasePrice.toNumber())
      .withStatus(raw.status as AssetStatus)
      .withPurchaseDate(raw.purchaseDate)
      .withWarrantyExpiryDate(raw.warrantyExpiryDate)
      .inDepartment(raw.currentDepartmentId)
      .assignedTo(raw.currentUserId)
      .withLocation(raw.location)
      .withSpecifications(raw.specifications)
      .withModel(raw.model)
      .withSerialNumber(raw.serialNumber)
      .withManufacturer(raw.manufacturer)
      .withCondition(raw.condition as AssetCondition)
      .withOriginalCost(raw.originalCost.toNumber())
      .withCurrentValue(raw.currentValue.toNumber())
      .withTimestamps(raw.createdAt, raw.updatedAt, raw.deletedAt);

    return builder.build();
  }

  static toPersistence(asset: Asset): Prisma.AssetCreateArgs {
    return {
      data: {
        id: asset.id,
        organizationId: asset.organizationId,
        categoryId: asset.categoryId,
        createdByUserId: asset.createdByUserId,
        assetName: asset.assetName,
        assetCode: asset.assetCode,
        purchasePrice: asset.purchasePrice,
        originalCost: asset.originalCost,
        currentValue: asset.currentValue,
        status: asset.status,
        currentDepartmentId: asset.currentDepartmentId,
        currentUserId: asset.currentUserId,
        model: asset.model,
        serialNumber: asset.serialNumber,
        manufacturer: asset.manufacturer,
        purchaseDate: asset.purchaseDate,
        warrantyExpiryDate: asset.warrantyExpiryDate,
        location: asset.location,
        specifications: asset.specifications,
        condition: asset.condition,
        createdAt: asset.createdAt,
        updatedAt: asset.updatedAt,
        deletedAt: asset.deletedAt,
      },
    };
  }
}

import {
  AssetTransfer,
  AssetTransferStatus,
  AssetTransferType,
} from 'src/domain/asset-lifecycle/asset-transfer';
import { AssetTransfer as PrismaAssetTransfer } from 'generated/prisma/client';

export class AssetTransferMapper {
  static toDomain(raw: PrismaAssetTransfer): AssetTransfer {
    const builder = AssetTransfer.builder(
      raw.id,
      raw.assetId,
      raw.organizationId,
      raw.transferType as AssetTransferType,
    )
      .onDate(raw.transferDate)
      .fromDepartment(raw.fromDepartmentId)
      .toDepartment(raw.toDepartmentId)
      .fromUser(raw.fromUserId)
      .toUser(raw.toUserId)
      .approvedBy(raw.approvedByUserId)
      .withReason(raw.reason)
      .withStatus(raw.status as AssetTransferStatus)
      .withTimestamps(raw.createdAt, raw.updatedAt);

    return builder.build();
  }

  static toPersistence(domain: AssetTransfer): {
    data: Omit<PrismaAssetTransfer, 'createdAt' | 'updatedAt'>;
  } {
    return {
      data: {
        id: domain.id,
        assetId: domain.assetId,
        organizationId: domain.organizationId,
        transferDate: domain.transferDate,
        transferType: domain.transferType,
        fromDepartmentId: domain.fromDepartmentId,
        toDepartmentId: domain.toDepartmentId,
        fromUserId: domain.fromUserId,
        toUserId: domain.toUserId,
        approvedByUserId: domain.approvedByUserId,
        reason: domain.reason,
        status: domain.status,
      },
    };
  }
}

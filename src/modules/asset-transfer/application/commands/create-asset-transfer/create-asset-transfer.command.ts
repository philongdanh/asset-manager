import { AssetTransferType } from '../../../domain';

export class CreateAssetTransferCommand {
  constructor(
    public readonly assetId: string,
    public readonly organizationId: string,
    public readonly transferType: AssetTransferType,
    public readonly transferDate: Date,
    public readonly reason: string | null,
    public readonly toDepartmentId: string | null,
    public readonly toUserId: string | null,
    public readonly createdByUserId: string,
    public readonly fromDepartmentId: string | null = null,
    public readonly fromUserId: string | null = null,
  ) {}
}

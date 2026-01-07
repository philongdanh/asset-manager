import { Exclude, Expose } from 'class-transformer';
import { AssetDepreciation, DepreciationMethod } from '../../../domain';
import type { AssetDepreciationResult } from '../../../application/dtos/asset-depreciation.result';

@Exclude()
export class AssetDepreciationResponse {
  @Expose()
  id: string;

  @Expose({ name: 'asset_id' })
  assetId: string;

  @Expose({ name: 'organization_id' })
  organizationId: string;

  @Expose({ name: 'depreciation_date' })
  depreciationDate: Date;

  @Expose()
  method: DepreciationMethod;

  @Expose({ name: 'depreciation_value' })
  depreciationValue: number;

  @Expose({ name: 'accumulated_depreciation' })
  accumulatedDepreciation: number;

  @Expose({ name: 'remaining_value' })
  remainingValue: number;

  @Expose({ name: 'depreciation_percentage' })
  depreciationPercentage: number | null;

  @Expose({ name: 'accounting_entry_id' })
  accountingEntryId: string | null;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;

  @Expose()
  asset: any | null;

  @Expose()
  organization: any | null;

  constructor(result: AssetDepreciationResult) {
    const { depreciation, asset, organization } = result;

    this.id = depreciation.id;
    this.assetId = depreciation.assetId;
    this.organizationId = depreciation.organizationId;
    this.depreciationDate = depreciation.depreciationDate;
    this.method = depreciation.method;
    this.depreciationValue = depreciation.depreciationValue;
    this.depreciationValue = depreciation.depreciationValue;
    this.accumulatedDepreciation = depreciation.accumulatedDepreciation;
    this.remainingValue = depreciation.remainingValue;
    this.accountingEntryId = depreciation.accountingEntryId;
    this.createdAt = depreciation.createdAt!;

    this.depreciationPercentage =
      asset && asset.originalCost > 0
        ? Number(
          ((depreciation.accumulatedDepreciation / asset.originalCost) * 100).toFixed(2),
        )
        : null;
    this.updatedAt = depreciation.updatedAt!;

    this.asset = asset
      ? {
        id: asset.id,
        asset_code: asset.assetCode,
        asset_name: asset.assetName,
      }
      : null;

    this.organization = organization
      ? { id: organization.id, name: organization.name }
      : null;
  }
}

import { DepreciationMethod } from 'src/domain/finance-accounting/asset-depreciation';

export class RecordDepreciationCommand {
  constructor(
    public readonly assetId: string,
    public readonly organizationId: string,
    public readonly method: DepreciationMethod,
    public readonly depreciationDate: Date,
    public readonly depreciationValue: number,
    public readonly accumulatedDepreciation: number,
    public readonly remainingValue: number,
  ) {}
}

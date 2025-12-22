import { CommandValidationException } from 'src/application/core/exceptions/command-validation.exception';

export class UpdateAssetCommand {
  constructor(
    public readonly organizationId: string,
    public readonly assetId: string,
    public readonly name?: string,
    public readonly categoryId?: string,
    public readonly purchasePrice?: number,
    public readonly purchaseDate?: Date,
    public readonly departmentId?: string | null,
    public readonly currentUserId?: string | null,
    public readonly location?: string | null,
    public readonly condition?: string | null,
    public readonly status?: string,
    public readonly model?: string | null,
    public readonly serialNumber?: string | null,
    public readonly specifications?: string | null,
    public readonly manufacturer?: string | null,
    public readonly warrantyExpiryDate?: Date | null,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.organizationId) {
      throw new CommandValidationException(
        [
          {
            field: 'organizationId',
            message: 'Organization ID is required',
          },
        ],
        UpdateAssetCommand.name,
      );
    }
    if (!this.assetId) {
      throw new CommandValidationException(
        [
          {
            field: 'assetId',
            message: 'Asset ID is required',
          },
        ],
        UpdateAssetCommand.name,
      );
    }
    if (
      this.name !== undefined &&
      (!this.name || this.name.trim().length === 0)
    ) {
      throw new CommandValidationException(
        [
          {
            field: 'name',
            message: 'Asset name cannot be empty',
          },
        ],
        UpdateAssetCommand.name,
      );
    }
    if (this.purchasePrice !== undefined && this.purchasePrice < 0) {
      throw new CommandValidationException(
        [
          {
            field: 'purchasePrice',
            message: 'Purchase price cannot be negative',
          },
        ],
        UpdateAssetCommand.name,
      );
    }
  }
}

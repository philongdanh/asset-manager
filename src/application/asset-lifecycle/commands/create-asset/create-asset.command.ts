import { CommandValidationException } from 'src/application/core/exceptions/command-validation.exception';

export class CreateAssetCommand {
  constructor(
    public readonly organizationId: string,
    public readonly createdByUserId: string,
    public readonly name: string,
    public readonly code: string,
    public readonly categoryId: string,
    public readonly purchasePrice: number = 0,
    public readonly purchaseDate?: Date | null,
    public readonly departmentId?: string | null,
    public readonly currentUserId?: string | null,
    public readonly location?: string | null,
    public readonly specifications?: string | null,
    public readonly model?: string | null,
    public readonly serialNumber?: string | null,
    public readonly manufacturer?: string | null,
    public readonly warrantyExpiryDate?: Date | null,
    public readonly condition?: string | null,
  ) {
    this.validate();
  }

  private validate(): void {
    const errors: Array<{ field: string; message: string }> = [];

    if (!this.organizationId) {
      errors.push({
        field: 'organizationId',
        message: 'Organization ID is required',
      });
    }

    if (!this.createdByUserId) {
      errors.push({
        field: 'createdByUserId',
        message: 'Created by user ID is required',
      });
    }

    if (!this.name || this.name.trim().length === 0) {
      errors.push({
        field: 'name',
        message: 'Asset name is required',
      });
    }

    if (!this.code || this.code.trim().length === 0) {
      errors.push({
        field: 'code',
        message: 'Asset code is required',
      });
    }

    if (!this.categoryId) {
      errors.push({
        field: 'categoryId',
        message: 'Category ID is required',
      });
    }

    if (this.purchasePrice < 0) {
      errors.push({
        field: 'purchasePrice',
        message: 'Purchase price cannot be negative',
      });
    }

    if (this.purchaseDate && this.purchaseDate > new Date()) {
      errors.push({
        field: 'purchaseDate',
        message: 'Purchase date cannot be in the future',
      });
    }

    if (
      this.purchaseDate &&
      this.warrantyExpiryDate &&
      this.warrantyExpiryDate <= this.purchaseDate
    ) {
      errors.push({
        field: 'warrantyExpiryDate',
        message: 'Warranty expiry date must be after purchase date',
      });
    }

    if (this.currentUserId && !this.departmentId) {
      errors.push({
        field: 'departmentId',
        message: 'Department ID is required when assigning to a user',
      });
    }

    if (errors.length > 0) {
      throw new CommandValidationException(errors, CreateAssetCommand.name);
    }
  }
}

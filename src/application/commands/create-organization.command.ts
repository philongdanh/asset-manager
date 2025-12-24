import { OrganizationStatus } from 'src/domain/identity/organization';
import { CommandValidationException } from '../core/exceptions';

export class CreateOrganizationCommand {
  constructor(
    public readonly name: string,
    public readonly status: OrganizationStatus,
    public readonly taxCode?: string,
    public readonly address?: string,
    public readonly phone?: string,
    public readonly email?: string,
    public readonly website?: string,
  ) {
    this.validate();
  }

  private validate(): void {
    const errors: Array<{ field: string; message: string }> = [];

    // Required fields validation
    if (!this.name || this.name.trim().length === 0) {
      errors.push({
        field: 'name',
        message: 'Organization name is required',
      });
    }

    if (!this.status) {
      errors.push({
        field: 'status',
        message: 'Organization status is required',
      });
    } else if (!Object.values(OrganizationStatus).includes(this.status)) {
      errors.push({
        field: 'status',
        message: 'Invalid organization status value',
      });
    }

    // Format validation
    if (this.taxCode && this.taxCode.trim().length === 0) {
      errors.push({
        field: 'taxCode',
        message: 'Tax code cannot be empty if provided',
      });
    }

    if (this.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        errors.push({
          field: 'email',
          message: 'Invalid email format',
        });
      }
    }

    if (this.website) {
      try {
        new URL(this.website);
      } catch {
        errors.push({
          field: 'website',
          message: 'Invalid website URL format',
        });
      }
    }

    if (errors.length > 0) {
      throw new CommandValidationException(
        errors,
        CreateOrganizationCommand.name,
      );
    }
  }
}

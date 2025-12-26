import { OrganizationStatus } from 'src/domain/identity/organization';
import { CommandValidationException } from 'src/application/core/exceptions';

export class CreateOrganizationCommand {
  constructor(
    public readonly name: string,
    public readonly status: OrganizationStatus,
    public readonly phone: string | null,
    public readonly email: string | null,
    public readonly taxCode: string | null,
    public readonly website: string | null,
    public readonly address: string | null,
  ) {
    this.validate();
  }

  private validate(): void {
    const errors: Array<{ field: string; message: string }> = [];

    if (!this.name || this.name.trim().length === 0) {
      errors.push({
        field: 'name',
        message: 'Organization name is required',
      });
    }

    if (!Object.values(OrganizationStatus).includes(this.status)) {
      errors.push({
        field: 'status',
        message: 'Invalid organization status value',
      });
    }

    if (errors.length > 0) {
      throw new CommandValidationException(
        errors,
        CreateOrganizationCommand.name,
      );
    }
  }
}

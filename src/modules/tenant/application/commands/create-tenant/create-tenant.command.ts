import { CommandValidationException } from 'src/shared/application/exceptions';
import { TenantStatus } from 'src/modules/tenant';

export class CreateTenantCommand {
  constructor(
    public readonly name: string,
    public readonly status: TenantStatus,
    public readonly code: string | null,
    public readonly phone: string | null,
    public readonly email: string | null,
    public readonly website: string | null,
    public readonly address: string | null,
    public readonly logo: string | null,
  ) {
    this.validate();
  }

  private validate(): void {
    const errors: Array<{ field: string; message: string }> = [];

    if (!this.name || !this.name.trim().length) {
      errors.push({
        field: 'name',
        message: 'Tenant name is required',
      });
    }

    if (!Object.values(TenantStatus).includes(this.status)) {
      errors.push({
        field: 'status',
        message: 'Invalid organization status value',
      });
    }

    if (errors.length > 0) {
      throw new CommandValidationException(errors, CreateTenantCommand.name);
    }
  }
}

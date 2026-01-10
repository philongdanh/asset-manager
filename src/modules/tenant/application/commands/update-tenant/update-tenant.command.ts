import { CommandValidationException } from 'src/shared/application/exceptions';
import { TenantStatus } from 'src/modules/tenant';

export class UpdateTenantCommand {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly status?: TenantStatus,
    public readonly code?: string | null,
    public readonly phone?: string | null,
    public readonly email?: string | null,
    public readonly website?: string | null,
    public readonly address?: string | null,
    public readonly logo?: string | null,
  ) {
    this.validate();
  }

  private validate(): void {
    const errors: Array<{ field: string; message: string }> = [];

    if (this.status) {
      if (!Object.values(TenantStatus).includes(this.status)) {
        errors.push({
          field: 'status',
          message: 'Invalid tenant status value',
        });
      }
    }

    if (errors.length > 0) {
      throw new CommandValidationException(errors, UpdateTenantCommand.name);
    }
  }
}

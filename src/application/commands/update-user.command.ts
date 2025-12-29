import { UserStatus } from 'src/domain/identity/user';

export class UpdateUserCommand {
  constructor(
    public readonly id: string,
    public readonly email?: string,
    public readonly departmentId?: string | null,
    public readonly status?: UserStatus,
  ) {}
}

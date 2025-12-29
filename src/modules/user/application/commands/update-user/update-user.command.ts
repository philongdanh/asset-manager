import { UserStatus } from '../../../domain';

export class UpdateUserCommand {
  constructor(
    public readonly id: string,
    public readonly email?: string,
    public readonly departmentId?: string | null,
    public readonly status?: UserStatus,
    public readonly avatarUrl?: string | null,
  ) {}
}

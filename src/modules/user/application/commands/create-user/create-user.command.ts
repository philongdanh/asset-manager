import { UserStatus } from '../../../domain';

export class CreateUserCommand {
  constructor(
    public readonly organizationId: string,
    public readonly username: string,
    public readonly password: string,
    public readonly email: string,
    public readonly departmentId?: string | null,
    public readonly status?: UserStatus,
    public readonly avatarUrl?: string | null,
  ) { }
}

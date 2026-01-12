import { UserStatus } from '../../../domain';

export class UpdateUserCommand {
  constructor(
    public readonly id: string,
    public readonly email?: string,
    public readonly departmentId?: string | null,
    public readonly status?: UserStatus,
    public readonly avatarUrl?: string | null,
    public readonly fullName?: string | null,
    public readonly dateOfBirth?: Date | null,
    public readonly gender?: string | null,
    public readonly phoneNumber?: string | null,
  ) {}
}

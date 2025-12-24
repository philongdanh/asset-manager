export class CreateUserCommand {
  constructor(
    public readonly id: string,
    public readonly organizationId: string,
    public readonly username: string,
    public readonly email: string,
    public readonly departmentId?: string | null,
    public readonly status?: string,
  ) {}
}

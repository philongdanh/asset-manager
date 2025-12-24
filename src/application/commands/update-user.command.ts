export class UpdateUserCommand {
  constructor(
    public readonly userId: string,
    public readonly username?: string,
    public readonly email?: string,
    public readonly departmentId?: string | null,
  ) {}
}

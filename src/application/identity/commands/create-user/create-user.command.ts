export class CreateUserCommand {
  constructor(
    public readonly organizationId: string,
    public readonly username: string,
    public readonly email: string,
    public readonly department?: string,
    public readonly roleIds?: string[],
  ) {}
}

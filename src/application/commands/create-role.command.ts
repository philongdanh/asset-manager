export class CreateRoleCommand {
  constructor(
    public readonly id: string,
    public readonly organizationId: string,
    public readonly roleName: string,
  ) {}
}

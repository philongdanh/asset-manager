export class UpdateRoleCommand {
  constructor(
    public readonly roleId: string,
    public readonly roleName?: string,
    public readonly organizationId?: string,
  ) {}
}

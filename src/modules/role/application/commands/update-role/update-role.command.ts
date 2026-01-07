export class UpdateRoleCommand {
  constructor(
    public readonly roleId: string,
    public readonly name?: string,
    public readonly permissionIds?: string[],
    public readonly organizationId?: string,
  ) {}
}

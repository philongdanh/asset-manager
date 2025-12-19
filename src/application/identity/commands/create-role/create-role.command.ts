export class CreateRoleCommand {
  constructor(
    public readonly organizationId: string,
    public readonly name: string,
    public readonly permissionIds?: string[],
  ) {}
}

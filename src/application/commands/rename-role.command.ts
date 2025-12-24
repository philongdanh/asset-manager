export class RenameRoleCommand {
  constructor(
    public readonly roleId: string,
    public readonly roleName: string,
  ) {}
}

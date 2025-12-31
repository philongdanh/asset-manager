export class UpdatePermissionCommand {
  constructor(
    public readonly permissionId: string,
    public readonly name?: string,
    public readonly description?: string | null,
  ) {}
}

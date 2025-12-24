export class BulkAssignRolesCommand {
  constructor(
    public readonly userIds: string[],
    public readonly roleIds: string[],
  ) {}
}

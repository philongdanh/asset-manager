export class UpdateUserRolesCommand {
  constructor(
    public readonly userId: string,
    public readonly roleIds: string[],
  ) {}
}

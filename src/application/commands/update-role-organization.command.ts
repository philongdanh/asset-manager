export class UpdateRoleOrganizationCommand {
  constructor(
    public readonly roleId: string,
    public readonly organizationId: string,
  ) {}
}

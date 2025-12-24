export class UpdateOrganizationCommand {
  constructor(
    public readonly organizationId: string,
    public readonly orgName?: string,
    public readonly taxCode?: string | null,
    public readonly address?: string | null,
  ) {}
}

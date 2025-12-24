export class UpdateOrganizationContactCommand {
  constructor(
    public readonly organizationId: string,
    public readonly phone?: string | null,
    public readonly email?: string | null,
    public readonly website?: string | null,
  ) {}
}

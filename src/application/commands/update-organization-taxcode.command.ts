export class UpdateOrganizationTaxCodeCommand {
  constructor(
    public readonly organizationId: string,
    public readonly taxCode: string | null,
  ) {}
}

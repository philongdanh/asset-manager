export class UpdateOrganizationAddressCommand {
  constructor(
    public readonly organizationId: string,
    public readonly address: string | null,
  ) {}
}

export class UpdateInfoOrgCommand {
  constructor(
    public readonly organizationId: string,
    public readonly name?: string,
    public readonly taxCode?: string | null,
    public readonly phone?: string | null,
    public readonly email?: string | null,
    public readonly website?: string | null,
    public readonly address?: string | null,
  ) {}
}

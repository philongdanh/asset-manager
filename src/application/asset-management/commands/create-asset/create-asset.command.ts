export class CreateAssetCommand {
  constructor(
    public readonly organizationId: string,
    public readonly departmentId: string | null,
    public readonly name: string,
    public readonly code: string,
  ) {}
}

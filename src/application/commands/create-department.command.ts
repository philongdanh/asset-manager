export class CreateDepartmentCommand {
  constructor(
    public readonly id: string,
    public readonly organizationId: string,
    public readonly name: string,
    public readonly parentId?: string | null,
  ) {}
}

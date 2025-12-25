export class CreateDepartmentCommand {
  constructor(
    public readonly orgId: string,
    public readonly name: string,
    public readonly parentId: string | null,
  ) {}
}

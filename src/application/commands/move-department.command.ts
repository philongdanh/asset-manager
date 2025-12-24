export class MoveDepartmentCommand {
  constructor(
    public readonly departmentId: string,
    public readonly parentId: string | null,
  ) {}
}

export class UpdateDepartmentCommand {
  constructor(
    public readonly departmentId: string,
    public readonly name?: string,
    public readonly parentId?: string | null,
  ) {}
}

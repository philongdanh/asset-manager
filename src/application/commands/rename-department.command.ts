export class RenameDepartmentCommand {
  constructor(
    public readonly departmentId: string,
    public readonly name: string,
  ) {}
}

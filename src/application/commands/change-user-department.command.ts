export class ChangeUserDepartmentCommand {
  constructor(
    public readonly userId: string,
    public readonly departmentId: string | null,
  ) {}
}

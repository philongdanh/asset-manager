export class GetDepartmentByNameQuery {
  constructor(
    public readonly organizationId: string,
    public readonly name: string,
  ) {}
}

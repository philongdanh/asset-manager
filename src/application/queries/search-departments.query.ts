export class SearchDepartmentsQuery {
  constructor(
    public readonly organizationId: string,
    public readonly query: string,
    public readonly limit?: number,
  ) {}
}

export class GetRoleByNameQuery {
  constructor(
    public readonly organizationId: string,
    public readonly roleName: string,
  ) {}
}

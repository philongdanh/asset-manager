export class GetUsersWithRoleQuery {
  constructor(
    public readonly roleName: string,
    public readonly organizationId: string,
  ) {}
}

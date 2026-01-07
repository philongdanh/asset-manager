export class GetRoleDetailsQuery {
  constructor(
    public readonly roleId: string,
    public readonly organizationId?: string,
  ) {}
}

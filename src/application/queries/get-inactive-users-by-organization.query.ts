export class GetInactiveUsersByOrganizationQuery {
  constructor(
    public readonly organizationId: string,
    public readonly daysThreshold?: number,
  ) {}
}

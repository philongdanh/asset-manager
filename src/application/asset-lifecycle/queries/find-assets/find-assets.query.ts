export class FindAssetsQuery {
  constructor(
    public readonly organizationId: string,
    public readonly categoryId?: string,
    public readonly status?: string,
    public readonly limit?: number,
    public readonly offset?: number,
  ) {}
}

export class SearchUsersByKeywordQuery {
  constructor(
    public readonly organizationId: string,
    public readonly keyword: string,
  ) {}
}

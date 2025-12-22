export class FindAssetQuery {
  constructor(
    public readonly organizationId: string,
    public readonly assetId: string,
  ) {}
}

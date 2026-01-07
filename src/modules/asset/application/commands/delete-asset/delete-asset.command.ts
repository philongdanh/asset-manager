export class DeleteAssetCommand {
  constructor(
    public readonly tenantId: string,
    public readonly actorId: string,
    public readonly assetId: string,
  ) {}
}

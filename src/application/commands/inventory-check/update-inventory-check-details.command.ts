export class UpdateInventoryCheckDetailsCommand {
  constructor(
    public readonly inventoryCheckId: string,
    public readonly details: Array<{
      assetId: string;
      isFound: boolean;
      actualStatus: string;
      notes?: string;
    }>,
  ) {}
}

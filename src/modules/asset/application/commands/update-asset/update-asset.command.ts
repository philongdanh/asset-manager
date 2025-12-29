export class UpdateAssetCommand {
  constructor(
    public readonly assetId: string,
    public readonly assetName: string,
    public readonly categoryId: string,
    public readonly model: string | null,
    public readonly serialNumber: string | null,
    public readonly manufacturer: string | null,
    public readonly purchasePrice: number,
    public readonly originalCost: number,
    public readonly currentValue: number,
    public readonly purchaseDate: Date | null,
    public readonly warrantyExpiryDate: Date | null,
    public readonly condition: string | null,
    public readonly location: string | null,
    public readonly specifications: string | null,
    public readonly status: string,
    public readonly imageUrl: string | null,
  ) { }
}

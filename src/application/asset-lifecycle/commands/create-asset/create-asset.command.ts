export class CreateAssetCommand {
  constructor(
    public readonly organizationId: string,
    public readonly createdByUserId: string,
    public readonly name: string,
    public readonly code: string,
    public readonly categoryId: string,
    public readonly purchasePrice: number,
    public readonly purchaseDate: Date,
    public readonly departmentId?: string | null,
    public readonly currentUserId?: string | null,
    public readonly location?: string | null,
    public readonly description?: string | null,
    public readonly model?: string | null,
    public readonly serialNumber?: string | null,
  ) {}
}

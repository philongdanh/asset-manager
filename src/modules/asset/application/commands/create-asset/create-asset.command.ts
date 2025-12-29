export class CreateAssetCommand {
    constructor(
        public readonly organizationId: string,
        public readonly assetCode: string,
        public readonly assetName: string,
        public readonly categoryId: string,
        public readonly createdByUserId: string,
        public readonly purchasePrice: number,
        public readonly originalCost: number,
        public readonly currentValue: number,
        public readonly model: string | null,
        public readonly serialNumber: string | null,
        public readonly manufacturer: string | null,
        public readonly purchaseDate: Date | null,
        public readonly warrantyExpiryDate: Date | null,
        public readonly location: string | null,
        public readonly specifications: string | null,
        public readonly condition: string | null,
        public readonly status: string | null,
    ) { }
}

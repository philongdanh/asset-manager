import { AssetDisposalType } from '../../../domain';

export class CreateAssetDisposalCommand {
    constructor(
        public readonly assetId: string,
        public readonly organizationId: string,
        public readonly disposalType: AssetDisposalType,
        public readonly disposalDate: Date,
        public readonly disposalValue: number,
        public readonly reason: string | null,
    ) { }
}

import { AssetDisposalStatus, AssetDisposalType } from 'src/domain/asset-lifecycle/asset-disposal';

export class GetAssetDisposalsQuery {
    constructor(
        public readonly organizationId: string,
        public readonly options?: {
            status?: AssetDisposalStatus;
            disposalType?: AssetDisposalType;
            startDate?: Date;
            endDate?: Date;
            limit?: number;
            offset?: number;
        },
    ) { }
}

export class ApproveAssetDisposalCommand {
    constructor(
        public readonly id: string,
        public readonly approvedByUserId: string,
    ) { }
}

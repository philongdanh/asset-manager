export class RejectAssetDisposalCommand {
    constructor(
        public readonly id: string,
        public readonly rejectedByUserId: string,
        public readonly reason: string,
    ) { }
}

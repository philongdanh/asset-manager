export class RejectAssetTransferCommand {
    constructor(
        public readonly transferId: string,
        public readonly rejectedByUserId: string,
        public readonly reason: string,
    ) { }
}

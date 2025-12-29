export class ApproveAssetTransferCommand {
  constructor(
    public readonly transferId: string,
    public readonly approvedByUserId: string,
  ) {}
}

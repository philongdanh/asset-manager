export class CancelAssetTransferCommand {
  constructor(
    public readonly transferId: string,
    public readonly reason: string,
  ) {}
}

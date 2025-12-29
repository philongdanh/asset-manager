import { IsNotEmpty, IsString } from 'class-validator';

export class RejectAssetTransferRequest {
    @IsString()
    @IsNotEmpty()
    reason: string;
}

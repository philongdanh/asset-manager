import { IsNotEmpty, IsString } from 'class-validator';

export class CancelAssetTransferRequest {
    @IsString()
    @IsNotEmpty()
    reason: string;
}

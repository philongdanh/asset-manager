import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CancelAssetTransferRequest {
  @Expose()
  @IsString()
  @IsNotEmpty()
  reason: string;
}

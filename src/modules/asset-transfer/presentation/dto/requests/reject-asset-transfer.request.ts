import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class RejectAssetTransferRequest {
  @Expose()
  @IsString()
  @IsNotEmpty()
  reason: string;
}
